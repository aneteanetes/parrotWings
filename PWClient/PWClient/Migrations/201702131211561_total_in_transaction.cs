namespace PWClient.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class total_in_transaction : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Transactions", "owner_pw_total", c => c.Int(nullable: false));
            AddColumn("dbo.Transactions", "target_pw_total", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Transactions", "target_pw_total");
            DropColumn("dbo.Transactions", "owner_pw_total");
        }
    }
}
