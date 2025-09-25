# WebOnlyAPI - Admin Panel Backend

A complete ASP.NET Core Web API for managing the admin panel of the WebOnly website.

## Features

- **CRUD Operations** for all entities (Employees, Products, Equipment, Services, References)
- **Entity Framework Core** with SQL Server
- **Swagger/OpenAPI** documentation
- **CORS** enabled for frontend integration
- **DTOs** for clean data transfer
- **Service Layer** for business logic separation

## Project Structure

```
WebOnlyAPI/
├── Controllers/           # API endpoints
├── Data/                 # Database context
├── DTOs/                 # Data transfer objects
├── Models/               # Entity models
├── Services/             # Business logic services
└── cd           # Application configuration
```

## Database Entities

### Employee
- Id, Heading, JobName, Telefon, Mail, LinkedIn, ImageUrl
- CreatedAt, UpdatedAt

### Product
- Id, Name, Subtext, ImageUrl
- CreatedAt, UpdatedAt

### Equipment
- Id, Name, Features, Title, Specs, ImageUrl
- CreatedAt, UpdatedAt

### Service
- Id, Name, Subtext, ImageUrl
- CreatedAt, UpdatedAt

### Reference
- Id, Name, ImageUrl
- CreatedAt, UpdatedAt

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## Setup Instructions

1. **Install Dependencies**
   ```bash
   dotnet restore
   ```

2. **Update Connection String**
   - Edit `appsettings.json`
   - Update the `DefaultConnection` string to point to your SQL Server

3. **Create Database**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the API**
   ```bash
   dotnet run
   ```

5. **Access Swagger Documentation**
   - Navigate to `https://localhost:7000/swagger` (or your configured port)

## Configuration

### Database Connection
The API uses Entity Framework Core with SQL Server. Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=WebOnlyAPI;Trusted_Connection=true;"
  }
}
```

### CORS
CORS is configured to allow all origins for development. For production, update the CORS policy in `Program.cs`.

## Development

### Adding New Entities
1. Create the model in `Models/`
2. Create DTOs in `DTOs/`
3. Create service interface and implementation in `Services/`
4. Create controller in `Controllers/`
5. Register the service in `Program.cs`
6. Add DbSet to `ApplicationDbContext`

### Database Migrations
```bash
# Create new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

## Frontend Integration

The API is configured with CORS to allow requests from your React frontend. The frontend can make HTTP requests to:

- Base URL: `https://localhost:7000/api`
- Swagger: `https://localhost:7000/swagger`

## Next Steps

1. **File Upload**
   - Add image upload functionality
   - Configure file storage (local or cloud)

2. **Validation**
   - Add comprehensive input validation
   - Implement custom validation attributes

3. **Logging**
   - Add structured logging
   - Configure log levels

4. **Testing**
   - Add unit tests
   - Add integration tests



## Technologies Used

- **ASP.NET Core 8.0**
- **Entity Framework Core**
- **SQL Server**
- **Swagger/OpenAPI**
- **CORS**
