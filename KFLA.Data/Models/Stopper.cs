using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Data.Models
{
    public class Stopper
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Problem { get; set; }
        public string NotProblem { get; set; }
        public int StopperTypeID { get; set; }

        public StopperType StopperType { get; set; }
        public List<StopperQuestion> Questions { get; set; }
    }
}
