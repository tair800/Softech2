using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Data
{
    // Read-only context pointed at the legacy SQL Server to extract existing data
    public class LegacySqlServerDbContext : DbContext
    {
        public LegacySqlServerDbContext(DbContextOptions<LegacySqlServerDbContext> options)
            : base(options)
        {
        }

        public DbSet<AboutLogo> AboutLogos { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
        public DbSet<EquipmentCategoryMapping> EquipmentCategoryMapping { get; set; }
        public DbSet<EquipmentFeature> EquipmentFeatures { get; set; }
        public DbSet<EquipmentSpecification> EquipmentSpecifications { get; set; }
        public DbSet<EquipmentTag> EquipmentTags { get; set; }
        public DbSet<EquipmentTagMapping> EquipmentTagMapping { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductSection> ProductSections { get; set; }
        public DbSet<Reference> References { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Slider> Sliders { get; set; }
        public DbSet<VisitorAnalytics> VisitorAnalytics { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistory { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite keys to satisfy EF model validation for join tables
            modelBuilder.Entity<EquipmentCategoryMapping>()
                .HasKey(ecm => new { ecm.EquipmentId, ecm.CategoryId });

            modelBuilder.Entity<EquipmentTagMapping>()
                .HasKey(etm => new { etm.EquipmentId, etm.TagId });
        }
    }
}


