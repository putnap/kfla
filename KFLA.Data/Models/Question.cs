using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Data.Models
{
    public class Question
    {
        public int ID { get; set; }
        public string QuestionContent { get; set; }
        public int CompetencyID { get; set; }
    }
}
