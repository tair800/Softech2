using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;

namespace WebOnlyAPI
{
    public class SampleDataSeeder
    {
        private readonly ApplicationDbContext _context;

        public SampleDataSeeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedSampleDataAsync()
        {
            // Check if categories already exist
            if (await _context.EquipmentCategories.AnyAsync())
            {
                Console.WriteLine("Categories already exist, skipping...");
                return;
            }

            // Add sample categories
            var categories = new[]
            {
                new Models.EquipmentCategory
                {
                    Name = "Industrial Equipment",
                    Description = "Heavy-duty industrial machinery and equipment",
                    Icon = "factory",
                    Color = "#FF6B6B",
                    OrderIndex = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentCategory
                {
                    Name = "Medical Devices",
                    Description = "Medical and healthcare equipment",
                    Icon = "medical",
                    Color = "#4ECDC4",
                    OrderIndex = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentCategory
                {
                    Name = "IT Equipment",
                    Description = "Information technology and computer equipment",
                    Icon = "computer",
                    Color = "#45B7D1",
                    OrderIndex = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentCategory
                {
                    Name = "Laboratory Equipment",
                    Description = "Scientific and laboratory instruments",
                    Icon = "flask",
                    Color = "#96CEB4",
                    OrderIndex = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentCategory
                {
                    Name = "Construction Equipment",
                    Description = "Construction and building equipment",
                    Icon = "hammer",
                    Color = "#FFEAA7",
                    OrderIndex = 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.EquipmentCategories.AddRange(categories);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Added {categories.Length} categories");

            // Add sample tags
            var tags = new[]
            {
                new Models.EquipmentTag
                {
                    Name = "High Performance",
                    Description = "Equipment with high performance capabilities",
                    Color = "#E17055",
                    OrderIndex = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentTag
                {
                    Name = "Energy Efficient",
                    Description = "Equipment designed for energy efficiency",
                    Color = "#00B894",
                    OrderIndex = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentTag
                {
                    Name = "Portable",
                    Description = "Lightweight and portable equipment",
                    Color = "#74B9FF",
                    OrderIndex = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentTag
                {
                    Name = "Automated",
                    Description = "Automated and smart equipment",
                    Color = "#A29BFE",
                    OrderIndex = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentTag
                {
                    Name = "Durable",
                    Description = "Long-lasting and durable equipment",
                    Color = "#FD79A8",
                    OrderIndex = 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Models.EquipmentTag
                {
                    Name = "Precision",
                    Description = "High precision and accuracy equipment",
                    Color = "#FDCB6E",
                    OrderIndex = 6,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.EquipmentTags.AddRange(tags);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Added {tags.Length} tags");
        }
    }
}
