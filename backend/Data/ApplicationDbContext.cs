using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Models;

namespace WebOnlyAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties for all models
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
        public DbSet<Blog> Blogs { get; set; }
        
        // User system DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistory { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names and relationships
            modelBuilder.Entity<AboutLogo>().ToTable("AboutLogos");
            modelBuilder.Entity<Employee>().ToTable("Employees");
            modelBuilder.Entity<Equipment>().ToTable("Equipment");
            modelBuilder.Entity<EquipmentCategory>().ToTable("EquipmentCategories");
            modelBuilder.Entity<EquipmentCategoryMapping>().ToTable("EquipmentCategoryMapping");
            modelBuilder.Entity<EquipmentFeature>().ToTable("EquipmentFeatures");
            modelBuilder.Entity<EquipmentSpecification>().ToTable("EquipmentSpecifications");
            modelBuilder.Entity<EquipmentTag>().ToTable("EquipmentTags");
            modelBuilder.Entity<EquipmentTagMapping>().ToTable("EquipmentTagMapping");
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<ProductImage>().ToTable("ProductImages");
            modelBuilder.Entity<ProductSection>().ToTable("ProductSections");
            modelBuilder.Entity<Reference>().ToTable("References");
            modelBuilder.Entity<Service>().ToTable("Services");
            modelBuilder.Entity<Slider>().ToTable("Sliders");
            modelBuilder.Entity<VisitorAnalytics>().ToTable("VisitorAnalytics");
            modelBuilder.Entity<Blog>().ToTable("Blogs");

            // Configure relationships
            modelBuilder.Entity<Equipment>()
                .HasMany(e => e.FeaturesList)
                .WithOne(f => f.Equipment)
                .HasForeignKey(f => f.EquipmentId);

            modelBuilder.Entity<Equipment>()
                .HasMany(e => e.Specifications)
                .WithOne(s => s.Equipment)
                .HasForeignKey(s => s.EquipmentId);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Images)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId);

            // Configure many-to-many relationships for Equipment Categories and Tags
            modelBuilder.Entity<EquipmentCategoryMapping>()
                .HasKey(ecm => new { ecm.EquipmentId, ecm.CategoryId });

            modelBuilder.Entity<EquipmentTagMapping>()
                .HasKey(etm => new { etm.EquipmentId, etm.TagId });

            // Configure User system relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.UserSessions)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.LoginHistory)
                .WithOne(h => h.User)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasMany(u => u.PasswordResetTokens)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed some initial data if needed
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Add any initial seed data here if needed
            // This will be called during migrations
        }
    }
}
