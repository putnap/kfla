using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract
{
    public class Tip
    {
        public string Phrase { get; set; }

        public string TipContent { get; set; }

        public List<string> WantToLearnMore { get; set; } = new List<string>();
    }
}
