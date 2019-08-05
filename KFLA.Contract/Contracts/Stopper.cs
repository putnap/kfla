using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class Stopper
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public List<string> Problem { get; set; }
        public List<string> NotProblem { get; set; }
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

        public string Context { get; set; }

        public List<string> Quotes { get; set; } = new List<string>();

        public List<string> Causes { get; set; } = new List<string>();

        public List<string> OtherCausesBeingLessSkilled { get; set; } = new List<string>();

        public List<string> OtherCausesOverusing { get; set; } = new List<string>();

        public List<Tip> Tips { get; set; } = new List<Tip>();

        public List<string> JobAssignments { get; set; } = new List<string>();

        public List<string> LearningResources { get; set; } = new List<string>();
    }
}
