using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract.Contracts
{
    public class EvaluationDto
    {
        [JsonProperty(PropertyName = "i")]
        public int ID { get; set; }
        [JsonProperty(PropertyName = "c")]
        public List<int> Competencies { get; set; }
    }
}
