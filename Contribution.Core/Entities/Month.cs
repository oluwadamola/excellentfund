﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contribution.Core.Entities
{
    public class Month
    {
        public int MonthId { get; set; }
        public string MonthName { get; set; }
        public virtual ICollection<Contribute> Contributes { get; set; }
        public virtual ICollection<Collector> Collectors{ get; set; }
    }
}
