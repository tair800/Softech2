using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitorAnalyticsController : ControllerBase
    {
        private readonly IVisitorAnalyticsService _visitorAnalyticsService;

        public VisitorAnalyticsController(IVisitorAnalyticsService visitorAnalyticsService)
        {
            _visitorAnalyticsService = visitorAnalyticsService;
        }

        [HttpPost("track")]
        public async Task<IActionResult> TrackVisitor([FromBody] VisitorAnalyticsDto visitorData)
        {
            try
            {
                await _visitorAnalyticsService.TrackVisitorAsync(visitorData);
                return Ok(new { message = "Visitor tracked successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to track visitor", details = ex.Message });
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetAnalyticsSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var summary = await _visitorAnalyticsService.GetAnalyticsSummaryAsync(startDate, endDate);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to get analytics summary", details = ex.Message });
            }
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentVisitors([FromQuery] int count = 10)
        {
            try
            {
                var visitors = await _visitorAnalyticsService.GetRecentVisitorsAsync(count);
                return Ok(visitors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to get recent visitors", details = ex.Message });
            }
        }
    }
}
