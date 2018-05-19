using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Contract
{
    public class CompetencyDto
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

        public ClusterDto Cluster { get; set; }
        public FactorDto Factor { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }
}
