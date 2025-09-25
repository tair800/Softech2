using Microsoft.AspNetCore.Mvc;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Services;

namespace WebOnlyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult> GetEmployees([FromQuery] string? language, [FromQuery] bool raw = false)
        {
            if (raw)
            {
                // Return raw entities with all multilingual fields for admin UI
                var list = await _employeeService.GetAllEmployeesAsync();
                return Ok(list);
            }
            var employees = await _employeeService.GetAllEmployeesAsync(language);
            return Ok(employees);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetEmployee(int id, [FromQuery] string? language, [FromQuery] bool raw = false)
        {
            if (raw)
            {
                var rawEmp = await _employeeService.GetEmployeeByIdAsync(id);
                return rawEmp == null ? NotFound() : Ok(rawEmp);
            }
            var employee = await _employeeService.GetEmployeeByIdAsync(id, language);
            return employee == null ? NotFound() : Ok(employee);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<EmployeeResponseDto>> CreateEmployee(CreateEmployeeDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var employee = await _employeeService.CreateEmployeeAsync(createDto);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var employee = await _employeeService.UpdateEmployeeAsync(id, updateDto);
            
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        // DELETE: api/employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
