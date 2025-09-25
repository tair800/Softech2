using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Services
{
    public class EquipmentService : IEquipmentService
    {
        private readonly ApplicationDbContext _context;
        public EquipmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EquipmentListResponseDto>> GetAllAsync(string? language = null)
        {
            var equipments = await _context.Equipment
                .Include(e => e.CategoryMappings)
                    .ThenInclude(cm => cm.Category)
                .Include(e => e.TagMappings)
                    .ThenInclude(tm => tm.Tag)
                .OrderBy(e => e.CreatedAt)
                .ToListAsync();

            var list = equipments.Select(e => new EquipmentListResponseDto
            {
                Id = e.Id,
                Name = e.Name,
                Version = e.Version,
                Core = e.Core,
                ImageUrl = e.ImageUrl,
                CategoryNames = e.CategoryMappings.Select(cm => cm.Category.Name).ToList(),
                TagNames = e.TagMappings.Select(tm => tm.Tag.Name).ToList()
            }).ToList();

            // No language overrides for equipment list; names are unique

            return list;
        }

        public async Task<IEnumerable<EquipmentResponseDto>> GetAllFullAsync(string? language = null)
        {
            try
            {
                var list = await _context.Equipment
                    .Include(e => e.FeaturesList.OrderBy(f => f.OrderIndex))
                    .Include(e => e.Specifications.OrderBy(s => s.OrderIndex))
                    .Include(e => e.CategoryMappings)
                        .ThenInclude(cm => cm.Category)
                    .Include(e => e.TagMappings)
                        .ThenInclude(tm => tm.Tag)
                    .OrderBy(e => e.CreatedAt)
                    .ToListAsync();
                
                // Filter out items with null navigation properties to prevent MapToResponse errors
                var validItems = list.Where(e => 
                    e.CategoryMappings?.All(cm => cm.Category != null) == true &&
                    e.TagMappings?.All(tm => tm.Tag != null) == true
                ).ToList();
                
                var dtos = validItems.Select(MapToResponse).ToList();
                // No language overrides for equipment full; names are unique
                return dtos;
            }
            catch (Exception ex)
            {
                // Log the error and return empty list instead of crashing
                Console.WriteLine($"Error in GetAllFullAsync: {ex.Message}");
                return new List<EquipmentResponseDto>();
            }
        }

        public async Task<EquipmentResponseDto?> GetByIdAsync(int id, string? language = null)
        {
            try
            {
                var e = await _context.Equipment
                    .Include(eq => eq.FeaturesList.OrderBy(f => f.OrderIndex))
                    .Include(eq => eq.Specifications.OrderBy(s => s.OrderIndex))
                    .Include(eq => eq.CategoryMappings)
                        .ThenInclude(cm => cm.Category)
                    .Include(eq => eq.TagMappings)
                        .ThenInclude(tm => tm.Tag)
                    .FirstOrDefaultAsync(eq => eq.Id == id);
                
                if (e == null) return null;
                
                // Check if navigation properties are valid
                if (e.CategoryMappings?.Any(cm => cm.Category == null) == true ||
                    e.TagMappings?.Any(tm => tm.Tag == null) == true)
                {
                    Console.WriteLine($"Equipment {id} has null navigation properties, skipping MapToResponse");
                    return null;
                }
                
                var dto = MapToResponse(e);
                // No language overrides for equipment detail; names are unique
                return dto;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByIdAsync for equipment {id}: {ex.Message}");
                return null;
            }
        }

        public async Task<EquipmentResponseDto> CreateAsync(CreateEquipmentDto dto)
        {
            var e = new Equipment
            {
                Name = dto.Name,
                Version = dto.Version,
                Core = dto.Core,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                DescriptionEn = dto.DescriptionEn,
                DescriptionRu = dto.DescriptionRu,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Equipment.Add(e);
            await _context.SaveChangesAsync();

            // Add features
            if (dto.Features?.Any() == true)
            {
                foreach (var featureDto in dto.Features)
                {
                    var feature = new EquipmentFeature
                    {
                        EquipmentId = e.Id,
                        Feature = featureDto.Feature,
                        FeatureEn = featureDto.FeatureEn,
                        FeatureRu = featureDto.FeatureRu,
                        OrderIndex = featureDto.OrderIndex,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.EquipmentFeatures.Add(feature);
                }
            }

            // Add specifications
            if (dto.Specifications?.Any() == true)
            {
                foreach (var specDto in dto.Specifications)
                {
                    var spec = new EquipmentSpecification
                    {
                        EquipmentId = e.Id,
                        Key = specDto.Key,
                        KeyEn = specDto.KeyEn,
                        KeyRu = specDto.KeyRu,
                        Value = specDto.Value,
                        ValueEn = specDto.ValueEn,
                        ValueRu = specDto.ValueRu,
                        OrderIndex = specDto.OrderIndex,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.EquipmentSpecifications.Add(spec);
                }
            }

            // Add category mappings
            if (dto.CategoryIds?.Any() == true)
            {
                foreach (var categoryId in dto.CategoryIds)
                {
                    var categoryMapping = new EquipmentCategoryMapping
                    {
                        EquipmentId = e.Id,
                        CategoryId = categoryId
                    };
                    _context.EquipmentCategoryMapping.Add(categoryMapping);
                }
            }

            // Add tag mappings
            if (dto.TagIds?.Any() == true)
            {
                foreach (var tagId in dto.TagIds)
                {
                    var tagMapping = new EquipmentTagMapping
                    {
                        EquipmentId = e.Id,
                        TagId = tagId
                    };
                    _context.EquipmentTagMapping.Add(tagMapping);
                }
            }

            await _context.SaveChangesAsync();
            return MapToResponse(e);
        }

        public async Task<EquipmentResponseDto?> UpdateAsync(int id, UpdateEquipmentDto dto)
        {
            try
            {
                var e = await _context.Equipment
                    .Include(eq => eq.CategoryMappings)
                    .Include(eq => eq.TagMappings)
                    .Include(eq => eq.FeaturesList)
                    .Include(eq => eq.Specifications)
                    .FirstOrDefaultAsync(eq => eq.Id == id);
                
                if (e == null) return null;

                e.Name = dto.Name;
                e.Version = dto.Version;
                e.Core = dto.Core;
                e.Description = dto.Description;
                e.DescriptionEn = dto.DescriptionEn;
                e.DescriptionRu = dto.DescriptionRu;
                e.ImageUrl = dto.ImageUrl;
                e.UpdatedAt = DateTime.UtcNow;

                // Update features
                if (dto.Features != null)
                {
                    try
                    {
                        // Remove existing features from DbSet
                        var existingFeatures = await _context.EquipmentFeatures
                            .Where(f => f.EquipmentId == id)
                            .ToListAsync();
                        _context.EquipmentFeatures.RemoveRange(existingFeatures);
                        
                        // Add new features
                        foreach (var featureDto in dto.Features)
                        {
                            var feature = new EquipmentFeature
                            {
                                EquipmentId = e.Id,
                                Feature = featureDto.Feature,
                                FeatureEn = featureDto.FeatureEn,
                                FeatureRu = featureDto.FeatureRu,
                                OrderIndex = featureDto.OrderIndex,
                                CreatedAt = DateTime.UtcNow
                            };
                            _context.EquipmentFeatures.Add(feature);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Error updating features: {ex.Message}", ex);
                    }
                }

                // Update specifications
                if (dto.Specifications != null)
                {
                    try
                    {
                        // Remove existing specifications from DbSet
                        var existingSpecs = await _context.EquipmentSpecifications
                            .Where(s => s.EquipmentId == id)
                            .ToListAsync();
                        _context.EquipmentSpecifications.RemoveRange(existingSpecs);
                        
                        // Add new specifications
                        foreach (var specDto in dto.Specifications)
                        {
                            var spec = new EquipmentSpecification
                            {
                                EquipmentId = e.Id,
                                Key = specDto.Key,
                                KeyEn = specDto.KeyEn,
                                KeyRu = specDto.KeyRu,
                                Value = specDto.Value,
                                ValueEn = specDto.ValueEn,
                                ValueRu = specDto.ValueRu,
                                OrderIndex = specDto.OrderIndex,
                                CreatedAt = DateTime.UtcNow
                            };
                            _context.EquipmentSpecifications.Add(spec);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Error updating specifications: {ex.Message}", ex);
                    }
                }

                // Update category mappings
                if (dto.CategoryIds != null)
                {
                    try
                    {
                        // Remove existing category mappings from DbSet
                        var existingCategoryMappings = await _context.EquipmentCategoryMapping
                            .Where(cm => cm.EquipmentId == id)
                            .ToListAsync();
                        _context.EquipmentCategoryMapping.RemoveRange(existingCategoryMappings);
                        
                        // Add new category mappings
                        foreach (var categoryId in dto.CategoryIds)
                        {
                            var categoryMapping = new EquipmentCategoryMapping
                            {
                                EquipmentId = e.Id,
                                CategoryId = categoryId
                            };
                            _context.EquipmentCategoryMapping.Add(categoryMapping);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Error updating category mappings: {ex.Message}", ex);
                    }
                }

                // Update tag mappings
                if (dto.TagIds != null)
                {
                    try
                    {
                        // Remove existing tag mappings from DbSet
                        var existingTagMappings = await _context.EquipmentTagMapping
                            .Where(tm => tm.EquipmentId == id)
                            .ToListAsync();
                        _context.EquipmentTagMapping.RemoveRange(existingTagMappings);
                        
                        // Add new tag mappings
                        foreach (var tagId in dto.TagIds)
                        {
                            var tagMapping = new EquipmentTagMapping
                            {
                                EquipmentId = e.Id,
                                TagId = tagId
                            };
                            _context.EquipmentTagMapping.Add(tagMapping);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Error updating tag mappings: {ex.Message}", ex);
                    }
                }

                await _context.SaveChangesAsync();
                
                // Reload the equipment with all navigation properties to avoid null reference in MapToResponse
                var reloadedEquipment = await _context.Equipment
                    .Include(eq => eq.FeaturesList.OrderBy(f => f.OrderIndex))
                    .Include(eq => eq.Specifications.OrderBy(s => s.OrderIndex))
                    .Include(eq => eq.CategoryMappings)
                        .ThenInclude(cm => cm.Category)
                    .Include(eq => eq.TagMappings)
                        .ThenInclude(tm => tm.Tag)
                    .FirstOrDefaultAsync(eq => eq.Id == id);
                
                if (reloadedEquipment == null)
                    throw new Exception($"Equipment with ID {id} not found after update");
                
                return MapToResponse(reloadedEquipment);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in UpdateAsync for equipment {id}: {ex.Message}", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.Equipment.FindAsync(id);
            if (e == null) return false;
            _context.Equipment.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }

        private static EquipmentResponseDto MapToResponse(Equipment e)
        {
            return new EquipmentResponseDto
            {
                Id = e.Id,
                Name = e.Name,
                Version = e.Version,
                Core = e.Core,
                Description = e.Description,
                DescriptionEn = e.DescriptionEn,
                DescriptionRu = e.DescriptionRu,
                ImageUrl = e.ImageUrl,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
                Features = e.FeaturesList.Select(f => new EquipmentFeatureDto
                {
                    Id = f.Id,
                    Feature = f.Feature,
                    FeatureEn = f.FeatureEn,
                    FeatureRu = f.FeatureRu,
                    OrderIndex = f.OrderIndex
                }).ToList(),
                Specifications = e.Specifications.Select(s => new EquipmentSpecificationDto
                {
                    Id = s.Id,
                    Key = s.Key,
                    KeyEn = s.KeyEn,
                    KeyRu = s.KeyRu,
                    Value = s.Value,
                    ValueEn = s.ValueEn,
                    ValueRu = s.ValueRu,
                    OrderIndex = s.OrderIndex
                }).ToList(),
                Categories = e.CategoryMappings?.Where(cm => cm.Category != null).Select(cm => new EquipmentCategoryDto
                {
                    Id = cm.Category.Id,
                    Name = cm.Category.Name,
                    NameEn = cm.Category.NameEn,
                    NameRu = cm.Category.NameRu,
                    Description = cm.Category.Description,
                    DescriptionEn = cm.Category.DescriptionEn,
                    DescriptionRu = cm.Category.DescriptionRu,
                    Icon = cm.Category.Icon,
                    Color = cm.Category.Color,
                    OrderIndex = cm.Category.OrderIndex
                }).ToList() ?? new List<EquipmentCategoryDto>(),
                Tags = e.TagMappings?.Where(tm => tm.Tag != null).Select(tm => new EquipmentTagDto
                {
                    Id = tm.Tag.Id,
                    Name = tm.Tag.Name,
                    NameEn = tm.Tag.NameEn,
                    NameRu = tm.Tag.NameRu,
                    Description = tm.Tag.Description,
                    DescriptionEn = tm.Tag.DescriptionEn,
                    DescriptionRu = tm.Tag.DescriptionRu,
                    Color = tm.Tag.Color,
                    OrderIndex = tm.Tag.OrderIndex
                }).ToList() ?? new List<EquipmentTagDto>()
            };
        }

        public async Task<IEnumerable<EquipmentCategoryDto>> GetCategoriesAsync()
        {
            var categories = await _context.EquipmentCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.OrderIndex)
                .Select(c => new EquipmentCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    NameEn = c.NameEn,
                    NameRu = c.NameRu,
                    Description = c.Description,
                    DescriptionEn = c.DescriptionEn,
                    DescriptionRu = c.DescriptionRu,
                    Icon = c.Icon,
                    Color = c.Color,
                    OrderIndex = c.OrderIndex,
                    EquipmentCount = c.EquipmentMappings.Count
                })
                .ToListAsync();

            return categories;
        }

        public async Task<IEnumerable<EquipmentTagDto>> GetTagsAsync()
        {
            var tags = await _context.EquipmentTags
                .Where(t => t.IsActive)
                .OrderBy(t => t.OrderIndex)
                .Select(t => new EquipmentTagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    NameEn = t.NameEn,
                    NameRu = t.NameRu,
                    Description = t.Description,
                    DescriptionEn = t.DescriptionEn,
                    DescriptionRu = t.DescriptionRu,
                    Color = t.Color,
                    OrderIndex = t.OrderIndex,
                    EquipmentCount = t.EquipmentMappings.Count
                })
                .ToListAsync();

            return tags;
        }

        public async Task<IEnumerable<EquipmentResponseDto>> SearchByNameAsync(string searchTerm)
        {
            var results = await _context.Equipment
                .Include(e => e.FeaturesList.OrderBy(f => f.OrderIndex))
                .Include(e => e.Specifications.OrderBy(s => s.OrderIndex))
                .Include(e => e.CategoryMappings)
                    .ThenInclude(cm => cm.Category)
                .Include(e => e.TagMappings)
                    .ThenInclude(tm => tm.Tag)
                .Where(e => e.Name.ToLower().StartsWith(searchTerm.ToLower()))
                .OrderBy(e => e.CreatedAt)
                .ToListAsync();

            return results.Select(MapToResponse);
        }

        // Category CRUD operations
        public async Task<EquipmentCategoryDto> CreateCategoryAsync(CreateEquipmentCategoryDto dto)
        {
            var category = new EquipmentCategory
            {
                Name = dto.Name,
                NameEn = dto.NameEn,
                NameRu = dto.NameRu,
                Description = dto.Description,
                DescriptionEn = dto.DescriptionEn,
                DescriptionRu = dto.DescriptionRu,
                Icon = dto.Icon,
                Color = dto.Color,
                OrderIndex = dto.OrderIndex,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.EquipmentCategories.Add(category);
            await _context.SaveChangesAsync();

            return new EquipmentCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                NameEn = category.NameEn,
                NameRu = category.NameRu,
                Description = category.Description,
                DescriptionEn = category.DescriptionEn,
                DescriptionRu = category.DescriptionRu,
                Icon = category.Icon,
                Color = category.Color,
                OrderIndex = category.OrderIndex,
                EquipmentCount = 0 // New category has no equipment yet
            };
        }

        public async Task<EquipmentCategoryDto?> UpdateCategoryAsync(int id, UpdateEquipmentCategoryDto dto)
        {
            var category = await _context.EquipmentCategories.FindAsync(id);
            if (category == null) return null;

            category.Name = dto.Name;
            category.NameEn = dto.NameEn;
            category.NameRu = dto.NameRu;
            category.Description = dto.Description;
            category.DescriptionEn = dto.DescriptionEn;
            category.DescriptionRu = dto.DescriptionRu;
            category.Icon = dto.Icon;
            category.Color = dto.Color;
            category.OrderIndex = dto.OrderIndex;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new EquipmentCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                NameEn = category.NameEn,
                NameRu = category.NameRu,
                Description = category.Description,
                DescriptionEn = category.DescriptionEn,
                DescriptionRu = category.DescriptionRu,
                Icon = category.Icon,
                Color = category.Color,
                OrderIndex = category.OrderIndex,
                EquipmentCount = category.EquipmentMappings.Count
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.EquipmentCategories
                .Include(c => c.EquipmentMappings)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return false;

            // If category is used by equipment, deactivate it instead of deleting
            if (category.EquipmentMappings.Any())
            {
                category.IsActive = false;
                category.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            // If not used, delete it completely
            _context.EquipmentCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        // Tag CRUD operations
        public async Task<EquipmentTagDto> CreateTagAsync(CreateEquipmentTagDto dto)
        {
            var tag = new EquipmentTag
            {
                Name = dto.Name,
                NameEn = dto.NameEn,
                NameRu = dto.NameRu,
                Description = dto.Description,
                DescriptionEn = dto.DescriptionEn,
                DescriptionRu = dto.DescriptionRu,
                Color = dto.Color,
                OrderIndex = dto.OrderIndex,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.EquipmentTags.Add(tag);
            await _context.SaveChangesAsync();

            return new EquipmentTagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                NameEn = tag.NameEn,
                NameRu = tag.NameRu,
                Description = tag.Description,
                DescriptionEn = tag.DescriptionEn,
                DescriptionRu = tag.DescriptionRu,
                Color = tag.Color,
                OrderIndex = tag.OrderIndex,
                EquipmentCount = 0 // New tag has no equipment yet
            };
        }

        public async Task<EquipmentTagDto?> UpdateTagAsync(int id, UpdateEquipmentTagDto dto)
        {
            var tag = await _context.EquipmentTags.FindAsync(id);
            if (tag == null) return null;

            tag.Name = dto.Name;
            tag.NameEn = dto.NameEn;
            tag.NameRu = dto.NameRu;
            tag.Description = dto.Description;
            tag.DescriptionEn = dto.DescriptionEn;
            tag.DescriptionRu = dto.DescriptionRu;
            tag.Color = dto.Color;
            tag.OrderIndex = dto.OrderIndex;
            tag.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new EquipmentTagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                NameEn = tag.NameEn,
                NameRu = tag.NameRu,
                Description = tag.Description,
                DescriptionEn = tag.DescriptionEn,
                DescriptionRu = tag.DescriptionRu,
                Color = tag.Color,
                OrderIndex = tag.OrderIndex,
                EquipmentCount = tag.EquipmentMappings.Count
            };
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await _context.EquipmentTags
                .Include(t => t.EquipmentMappings)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null) return false;

            // If tag is used by equipment, deactivate it instead of deleting
            if (tag.EquipmentMappings.Any())
            {
                tag.IsActive = false;
                tag.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return true;
            }

            // If not used, delete it completely
            _context.EquipmentTags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> FixBlobUrlsAsync()
        {
            var equipmentWithBlobUrls = await _context.Equipment
                .Where(e => e.ImageUrl != null && e.ImageUrl.Contains("blob:"))
                .ToListAsync();

            var fixedCount = 0;
            foreach (var equipment in equipmentWithBlobUrls)
            {
                // Set proper image URL based on equipment ID
                if (equipment.Id <= 3)
                {
                    equipment.ImageUrl = "/uploads/equipment/equipment1.png";
                }
                else
                {
                    equipment.ImageUrl = "/uploads/equipment/equipment2.png";
                }
                fixedCount++;
            }

            await _context.SaveChangesAsync();
            return fixedCount;
        }

    }
}
