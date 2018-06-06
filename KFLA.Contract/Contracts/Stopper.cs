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
        public int StopperTypeID { get; set; }

        public StopperTypeDto StopperType { get; set; }
    }
}
