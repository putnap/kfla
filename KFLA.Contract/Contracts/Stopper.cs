using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class Stopper
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Problem { get; set; } = new List<string>();
        public IEnumerable<string> NotProblem { get; set; } = new List<string>();
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
        public IEnumerable<string> Questions { get; set; } = new List<string>();

        public string Context { get; set; }

        public IEnumerable<string> Quotes { get; set; } = new List<string>();

        public IEnumerable<string> Causes { get; set; } = new List<string>();

        public IEnumerable<string> OtherCausesBeingLessSkilled { get; set; } = new List<string>();

        public IEnumerable<string> OtherCausesOverusing { get; set; } = new List<string>();

        public IEnumerable<Tip> Tips { get; set; } = new List<Tip>();

        public IEnumerable<string> JobAssignments { get; set; } = new List<string>();

        public IEnumerable<string> LearningResources { get; set; } = new List<string>();
    }
}
