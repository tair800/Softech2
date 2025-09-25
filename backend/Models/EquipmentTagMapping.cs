namespace WebOnlyAPI.Models
{
    public class EquipmentTagMapping
    {
        public int EquipmentId { get; set; }
        public int TagId { get; set; }
        
        // Navigation properties
        public virtual Equipment Equipment { get; set; } = null!;
        public virtual EquipmentTag Tag { get; set; } = null!;
    }
}

