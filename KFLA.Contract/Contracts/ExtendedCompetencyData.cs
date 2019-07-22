using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class ExtendedCompetencyData : Competency
    {
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
