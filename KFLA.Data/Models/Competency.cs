using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Data.Models
{
    public class Competency
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ClusterID { get; set; }
        public int? FactorID { get; set; }
        public string LessSkilled { get; set; }
        public string Skilled { get; set; }
        public string Talented { get; set; }
        public string OverusedSkill { get; set; }

        public Factor Factor { get; set; }
        public Cluster Cluster { get; set; }
        public List<Question> Questions { get; set; }
    }
}
