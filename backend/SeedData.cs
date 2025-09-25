using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;

namespace WebOnlyAPI
{
    public static class SeedData
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            var seeder = new SampleDataSeeder(context);
            await seeder.SeedSampleDataAsync();
        }
    }
}
