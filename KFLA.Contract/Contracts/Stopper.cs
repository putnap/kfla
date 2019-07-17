using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class Stopper
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Problem { get; set; }
        public string NotProblem { get; set; }
        public string ClusterID { get; set; }

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
        public List<StopperQuestion> Questions { get; set; } = new List<StopperQuestion>();
    }
}
