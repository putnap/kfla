using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Contract
{
    public class Competency
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

        private Cluster _cluster;
        public Cluster Cluster
        {
            get { return _cluster; }
            set
            {
                _cluster = value;
                ClusterID = value?.ID;
            }
        }

        private Factor _factor;
        public Factor Factor
        {
            get { return _factor; }
            set
            {
                _factor = value;
                FactorID = value?.ID;
            }
        }

        public List<Question> Questions { get; set; } = new List<Question>();
    }
}
