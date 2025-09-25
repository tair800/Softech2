using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("admin/transfer")] 
    public class AdminTransferController : ControllerBase
    {
        private readonly DataTransferService _transferService;

        public AdminTransferController(DataTransferService transferService)
        {
            _transferService = transferService;
        }

        [HttpGet("counts")]
        public async Task<IActionResult> Counts(CancellationToken ct)
        {
            var (source, target) = await _transferService.GetCountsAsync(ct);
            return Ok(new { source, target });
        }

        [HttpPost("sqlserver-to-sqlite")]
        public async Task<IActionResult> Transfer([FromQuery] bool force = false, CancellationToken ct = default)
        {
            await _transferService.TransferAllAsync(force, ct);
            var (source, target) = await _transferService.GetCountsAsync(ct);
            return Ok(new { status = "ok", source, target });
        }
    }
}


