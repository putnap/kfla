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
        public List<string> LessSkilled { get; set; }
        public List<string> Skilled { get; set; }
        public List<string> Talented { get; set; }
        public List<string> OverusedSkill { get; set; }

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

        public string Context { get; set; }

        public List<string> Quotes { get; set; } = new List<string>();

        public string Positioning { get; set; }

        public List<string> Causes { get; set; } = new List<string>();

        public List<(string Type, string CaseStudy)> CaseStudies { get; set; } = new List<(string Type, string CaseStudy)>();

        public List<Tip> Tips { get; set; } = new List<Tip>();

        public List<string> JobAssignments { get; set; } = new List<string>();

        public List<(string Statement, string Suggestion)> TimeToReflect { get; set; } = new List<(string Statement, string Suggestion)>();

        public List<string> LearnMore { get; set; } = new List<string>();

        public List<string> DeepDiveResources { get; set; } = new List<string>();
    }
}
