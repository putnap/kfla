using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Contract
{
    public class QuestionDto
    {
        public int ID { get; set; }
        public string QuestionContent { get; set; }
        public int CompetencyID { get; set; }
    }
}
