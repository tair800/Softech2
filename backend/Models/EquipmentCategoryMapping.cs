namespace WebOnlyAPI.Models
{
    public class EquipmentCategoryMapping
    {
        public int EquipmentId { get; set; }
        public int CategoryId { get; set; }
        
        // Navigation properties
        public virtual Equipment Equipment { get; set; } = null!;
        public virtual EquipmentCategory Category { get; set; } = null!;
    }
}

