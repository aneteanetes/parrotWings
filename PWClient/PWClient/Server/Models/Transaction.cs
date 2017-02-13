using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PWClient.Server.Models
{
    public class Transaction
    {
        public int id { get; set; }
        public string owner { get; set; }
        public string target { get; set; }
        public int amount { get; set; }
        public int owner_pw_total { get; set; }
        public int target_pw_total { get; set; }
        public DateTime when { get; set; }
    }
}