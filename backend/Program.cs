using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll",
//         builder =>
//         {
//             builder.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
//                    .AllowAnyMethod()
//                    .AllowAnyHeader()
//                    .AllowCredentials();
//         });
// });

// Add DbContext - SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.CommandTimeout(30)
    ));

// Legacy SQL Server context for one-time data transfer
builder.Services.AddDbContext<LegacySqlServerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionSqlServer")));

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IReferenceService, ReferenceService>();
builder.Services.AddScoped<DataSeederService>();
builder.Services.AddScoped<IVisitorAnalyticsService, VisitorAnalyticsService>();
builder.Services.AddScoped<DataTransferService>();
builder.Services.AddScoped<IBlogService, BlogService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "WebOnlyAPI v1");
        options.RoutePrefix = ""; // This will serve Swagger UI at the root
    });
}

app.UseHttpsRedirection();
// app.UseCors("AllowAll");
app.UseStaticFiles();

app.MapControllers();

// Ensure SQLite database is created/migrated on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    try
    {
        // Ensure multilingual columns exist for AboutLogos (SQLite safe best-effort)
        await db.Database.ExecuteSqlRawAsync("ALTER TABLE AboutLogos ADD COLUMN HeadingEn TEXT");
    }
    catch { }
    try
    {
        await db.Database.ExecuteSqlRawAsync("ALTER TABLE AboutLogos ADD COLUMN HeadingRu TEXT");
    }
    catch { }
    try
    {
        await db.Database.ExecuteSqlRawAsync("ALTER TABLE AboutLogos ADD COLUMN SubtextEn TEXT");
    }
    catch { }
    try
    {
        await db.Database.ExecuteSqlRawAsync("ALTER TABLE AboutLogos ADD COLUMN SubtextRu TEXT");
    }
    catch { }

    // Ensure multilingual columns exist for Employees (SQLite safe best-effort)
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Employees ADD COLUMN PositionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Employees ADD COLUMN PositionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Employees ADD COLUMN DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Employees ADD COLUMN DescriptionRu TEXT"); } catch { }

    // Ensure multilingual columns exist for Products (SQLite safe best-effort)
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN NameEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN NameRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN SubtextEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN SubtextRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN DetailDescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN DetailDescriptionRu TEXT"); } catch { }
    // Section 1
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1TitleEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1TitleRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1DescriptionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1MoreTextEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section1MoreTextRu TEXT"); } catch { }
    // Section 2
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2TitleEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2TitleRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2DescriptionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2MoreTextEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section2MoreTextRu TEXT"); } catch { }
    // Section 3
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3TitleEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3TitleRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3DescriptionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3MoreTextEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Products ADD COLUMN Section3MoreTextRu TEXT"); } catch { }
    // Equipment multilingual columns
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN NameEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN NameRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN VersionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN VersionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN CoreEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN CoreRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Equipment ADD COLUMN DescriptionRu TEXT"); } catch { }
    // Services multilingual columns
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN NameEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN NameRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN SubtitleEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN SubtitleRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN DescriptionEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN DescriptionRu TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN SubtextEn TEXT"); } catch { }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Services ADD COLUMN SubtextRu TEXT"); } catch { }
}

await app.RunAsync();
