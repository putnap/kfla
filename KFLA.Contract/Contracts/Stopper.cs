using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class StopperDto
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Problem { get; set; }
        public string NotProblem { get; set; }
        public string ClusterID { get; set; }

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
        public List<StopperQuestionDto> Questions { get; set; } = new List<StopperQuestionDto>();
    }
}
