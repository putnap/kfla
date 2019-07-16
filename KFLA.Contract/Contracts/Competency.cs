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
        public string ClusterID { get; set; }
        public string FactorID { get; set; }
        public string LessSkilled { get; set; }
        public string Skilled { get; set; }
        public string Talented { get; set; }
        public string OverusedSkill { get; set; }

        private ClusterDto _cluster;
        public ClusterDto Cluster
        {
            get { return _cluster; }
            set
            {
                _cluster = value;
                ClusterID = value?.ID;
            }
        }

        private FactorDto _factor;
        public FactorDto Factor
        {
            get { return _factor; }
            set
            {
                _factor = value;
                FactorID = value?.ID;
            }
        }

        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }
}
