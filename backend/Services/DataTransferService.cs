using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;

namespace WebOnlyAPI.Services
{
    public class DataTransferService
    {
        private readonly LegacySqlServerDbContext _source;
        private readonly ApplicationDbContext _target;
        private readonly IWebHostEnvironment _env;

        public DataTransferService(LegacySqlServerDbContext source, ApplicationDbContext target, IWebHostEnvironment env)
        {
            _source = source;
            _target = target;
            _env = env;
        }

        private static async Task<int> TryCountAsync<T>(IQueryable<T> query, CancellationToken ct) where T : class
        {
            try { return await query.CountAsync(ct); } catch { return 0; }
        }

        public async Task<(Dictionary<string,int> source, Dictionary<string,int> target)> GetCountsAsync(CancellationToken ct = default)
        {
            var s = new Dictionary<string, int>
            {
                [nameof(_source.Users)] = await TryCountAsync(_source.Users, ct),
                [nameof(_source.UserSessions)] = await TryCountAsync(_source.UserSessions, ct),
                [nameof(_source.UserLoginHistory)] = await TryCountAsync(_source.UserLoginHistory, ct),
                [nameof(_source.PasswordResetTokens)] = await TryCountAsync(_source.PasswordResetTokens, ct),
                [nameof(_source.AboutLogos)] = await TryCountAsync(_source.AboutLogos, ct),
                [nameof(_source.Employees)] = await TryCountAsync(_source.Employees, ct),
                [nameof(_source.Products)] = await TryCountAsync(_source.Products, ct),
                [nameof(_source.ProductImages)] = await TryCountAsync(_source.ProductImages, ct),
                [nameof(_source.ProductSections)] = await TryCountAsync(_source.ProductSections, ct),
                [nameof(_source.Services)] = await TryCountAsync(_source.Services, ct),
                [nameof(_source.References)] = await TryCountAsync(_source.References, ct),
                [nameof(_source.Sliders)] = await TryCountAsync(_source.Sliders, ct),
                [nameof(_source.VisitorAnalytics)] = await TryCountAsync(_source.VisitorAnalytics, ct),
                [nameof(_source.Equipment)] = await TryCountAsync(_source.Equipment, ct),
                [nameof(_source.EquipmentCategories)] = await TryCountAsync(_source.EquipmentCategories, ct),
                [nameof(_source.EquipmentTags)] = await TryCountAsync(_source.EquipmentTags, ct),
                [nameof(_source.EquipmentFeatures)] = await TryCountAsync(_source.EquipmentFeatures, ct),
                [nameof(_source.EquipmentSpecifications)] = await TryCountAsync(_source.EquipmentSpecifications, ct),
                [nameof(_source.EquipmentCategoryMapping)] = await TryCountAsync(_source.EquipmentCategoryMapping, ct),
                [nameof(_source.EquipmentTagMapping)] = await TryCountAsync(_source.EquipmentTagMapping, ct)
            };
            var t = new Dictionary<string, int>
            {
                [nameof(_target.Users)] = await TryCountAsync(_target.Users, ct),
                [nameof(_target.UserSessions)] = await TryCountAsync(_target.UserSessions, ct),
                [nameof(_target.UserLoginHistory)] = await TryCountAsync(_target.UserLoginHistory, ct),
                [nameof(_target.PasswordResetTokens)] = await TryCountAsync(_target.PasswordResetTokens, ct),
                [nameof(_target.AboutLogos)] = await TryCountAsync(_target.AboutLogos, ct),
                [nameof(_target.Employees)] = await TryCountAsync(_target.Employees, ct),
                [nameof(_target.Products)] = await TryCountAsync(_target.Products, ct),
                [nameof(_target.ProductImages)] = await TryCountAsync(_target.ProductImages, ct),
                [nameof(_target.ProductSections)] = await TryCountAsync(_target.ProductSections, ct),
                [nameof(_target.Services)] = await TryCountAsync(_target.Services, ct),
                [nameof(_target.References)] = await TryCountAsync(_target.References, ct),
                [nameof(_target.Sliders)] = await TryCountAsync(_target.Sliders, ct),
                [nameof(_target.VisitorAnalytics)] = await TryCountAsync(_target.VisitorAnalytics, ct),
                [nameof(_target.Equipment)] = await TryCountAsync(_target.Equipment, ct),
                [nameof(_target.EquipmentCategories)] = await TryCountAsync(_target.EquipmentCategories, ct),
                [nameof(_target.EquipmentTags)] = await TryCountAsync(_target.EquipmentTags, ct),
                [nameof(_target.EquipmentFeatures)] = await TryCountAsync(_target.EquipmentFeatures, ct),
                [nameof(_target.EquipmentSpecifications)] = await TryCountAsync(_target.EquipmentSpecifications, ct),
                [nameof(_target.EquipmentCategoryMapping)] = await TryCountAsync(_target.EquipmentCategoryMapping, ct),
                [nameof(_target.EquipmentTagMapping)] = await TryCountAsync(_target.EquipmentTagMapping, ct)
            };
            return (s, t);
        }

        public async Task<string> BackupSqliteAsync(CancellationToken ct = default)
        {
            await _target.Database.EnsureCreatedAsync(ct);
            var dataSource = _target.Database.GetDbConnection().DataSource ?? "webonly.db";
            // Resolve relative DB path against ContentRootPath first
            var dbPath = Path.IsPathRooted(dataSource)
                ? dataSource
                : Path.Combine(_env.ContentRootPath, dataSource);
            if (!File.Exists(dbPath))
            {
                // Fallback to base directory; if still not exists, skip backup
                var alt = Path.Combine(AppContext.BaseDirectory, dataSource);
                if (File.Exists(alt)) dbPath = alt; else return string.Empty;
            }
            var backupDir = Path.Combine(_env.ContentRootPath, "backups");
            Directory.CreateDirectory(backupDir);
            var backupPath = Path.Combine(backupDir, $"webonly-backup-{DateTime.UtcNow:yyyyMMddHHmmss}.db");
            File.Copy(dbPath, backupPath, overwrite: true);
            return backupPath;
        }

        public async Task TransferAllAsync(bool force, CancellationToken ct = default)
        {
            // Ensure target database exists
            await _target.Database.MigrateAsync(ct);

            // Disable change tracking for bulk inserts
            _target.ChangeTracker.AutoDetectChangesEnabled = false;

            // Safety: if target already has data, require force
            var anyExisting = await _target.Users.AnyAsync(ct) || await _target.Products.AnyAsync(ct) || await _target.Services.AnyAsync(ct);
            if (anyExisting && !force)
            {
                throw new InvalidOperationException("Target DB already contains data. Re-run with force=true to proceed after backup.");
            }

            // Backup before destructive operations
            await BackupSqliteAsync(ct);

            using var tx = await _target.Database.BeginTransactionAsync(ct);

            // Order: Users -> Domain roots -> children -> many-to-many (skip tables missing in source)
            await TryCopyAsync(_source.Users.AsNoTracking(), _target.Users, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.UserSessions.AsNoTracking(), _target.UserSessions, ct);
            await TryCopyAsync(_source.UserLoginHistory.AsNoTracking(), _target.UserLoginHistory, ct);
            await TryCopyAsync(_source.PasswordResetTokens.AsNoTracking(), _target.PasswordResetTokens, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.AboutLogos.AsNoTracking(), _target.AboutLogos, ct);
            await TryCopyAsync(_source.Employees.AsNoTracking(), _target.Employees, ct);
            await TryCopyAsync(_source.Products.AsNoTracking(), _target.Products, ct);
            await TryCopyAsync(_source.Services.AsNoTracking(), _target.Services, ct);
            await TryCopyAsync(_source.References.AsNoTracking(), _target.References, ct);
            await TryCopyAsync(_source.Sliders.AsNoTracking(), _target.Sliders, ct);
            await TryCopyAsync(_source.VisitorAnalytics.AsNoTracking(), _target.VisitorAnalytics, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.ProductImages.AsNoTracking(), _target.ProductImages, ct);
            await TryCopyAsync(_source.ProductSections.AsNoTracking(), _target.ProductSections, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.Equipment.AsNoTracking(), _target.Equipment, ct);
            await TryCopyAsync(_source.EquipmentCategories.AsNoTracking(), _target.EquipmentCategories, ct);
            await TryCopyAsync(_source.EquipmentTags.AsNoTracking(), _target.EquipmentTags, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.EquipmentFeatures.AsNoTracking(), _target.EquipmentFeatures, ct);
            await TryCopyAsync(_source.EquipmentSpecifications.AsNoTracking(), _target.EquipmentSpecifications, ct);
            await _target.SaveChangesAsync(ct);

            await TryCopyAsync(_source.EquipmentCategoryMapping.AsNoTracking(), _target.EquipmentCategoryMapping, ct);
            await TryCopyAsync(_source.EquipmentTagMapping.AsNoTracking(), _target.EquipmentTagMapping, ct);
            await _target.SaveChangesAsync(ct);

            await tx.CommitAsync(ct);
        }

        private static async Task CopyAsync<T>(IQueryable<T> query, DbSet<T> target, CancellationToken ct) where T : class
        {
            var batch = new List<T>(2048);
            await foreach (var entity in query.AsAsyncEnumerable().WithCancellation(ct))
            {
                batch.Add(entity);
                if (batch.Count >= 1000)
                {
                    await target.AddRangeAsync(batch, ct);
                    batch.Clear();
                }
            }
            if (batch.Count > 0)
            {
                await target.AddRangeAsync(batch, ct);
            }
        }

        private static async Task TryCopyAsync<T>(IQueryable<T> query, DbSet<T> target, CancellationToken ct) where T : class
        {
            try
            {
                await CopyAsync(query, target, ct);
            }
            catch
            {
                // Source table likely missing; skip
            }
        }
    }
}


