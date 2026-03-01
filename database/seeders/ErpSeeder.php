<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ErpSeeder extends Seeder {
    public function run(): void {
        $c=now();

        // Company
        $cid=DB::table('companies')->insertGetId(['name'=>'AccounTech BD Demo','name_bn'=>'?????? ?? ??','country'=>'Bangladesh','city'=>'Dhaka','currency_code'=>'BDT','fiscal_year_start'=>'07-01','language'=>'en','created_at'=>$c,'updated_at'=>$c]);

        // Currencies (no is_base col)
        foreach([['code'=>'BDT','name'=>'Bangladeshi Taka','symbol'=>'','exchange_rate'=>1,'is_active'=>true],['code'=>'USD','name'=>'US Dollar','symbol'=>'$','exchange_rate'=>110,'is_active'=>true],['code'=>'EUR','name'=>'Euro','symbol'=>'','exchange_rate'=>120,'is_active'=>true],['code'=>'GBP','name'=>'British Pound','symbol'=>'','exchange_rate'=>140,'is_active'=>true],['code'=>'SAR','name'=>'Saudi Riyal','symbol'=>'','exchange_rate'=>29,'is_active'=>true]] as $r){
            DB::table('currencies')->insertOrIgnore(array_merge($r,['created_at'=>$c,'updated_at'=>$c]));
        }

        // Fiscal year
        DB::table('fiscal_years')->insert(['company_id'=>$cid,'name'=>'FY 2024-25','start_date'=>'2024-07-01','end_date'=>'2025-06-30','status'=>'active','created_at'=>$c,'updated_at'=>$c]);

        // Tax rates
        foreach([['name'=>'VAT 15%','code'=>'VAT15','rate'=>15,'type'=>'vat'],['name'=>'VAT 5%','code'=>'VAT5','rate'=>5,'type'=>'vat'],['name'=>'VAT 7.5%','code'=>'VAT75','rate'=>7.5,'type'=>'vat'],['name'=>'Tax-Free','code'=>'ZERO','rate'=>0,'type'=>'vat'],['name'=>'TDS 10%','code'=>'TDS10','rate'=>10,'type'=>'tds'],['name'=>'TDS 5%','code'=>'TDS5','rate'=>5,'type'=>'tds']] as $r){
            DB::table('tax_rates')->insert(array_merge($r,['company_id'=>$cid,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]));
        }

        // Units
        foreach([['name'=>'Pieces','abbreviation'=>'pcs'],['name'=>'Kilogram','abbreviation'=>'kg'],['name'=>'Gram','abbreviation'=>'g'],['name'=>'Litre','abbreviation'=>'ltr'],['name'=>'Meter','abbreviation'=>'m'],['name'=>'Box','abbreviation'=>'box'],['name'=>'Dozen','abbreviation'=>'doz'],['name'=>'Hour','abbreviation'=>'hr']] as $r){
            DB::table('units')->insert(array_merge($r,['company_id'=>$cid,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]));
        }

        // Account Groups (no code/name_bn/is_system cols in schema)
        $gd=[
            ['1000','Current Assets','asset','debit'],['1100','Fixed Assets','asset','debit'],['1200','Other Assets','asset','debit'],
            ['2000','Current Liabilities','liability','credit'],['2100','Long-term Liabilities','liability','credit'],
            ['3000','Owner Equity','equity','credit'],
            ['4000','Sales Revenue','revenue','credit'],['4100','Other Income','revenue','credit'],
            ['5000','Cost of Goods Sold','expense','debit'],['5100','Operating Expenses','expense','debit'],['5200','Administrative Expenses','expense','debit'],['5300','Financial Expenses','expense','debit'],
        ];
        $gi=[];
        foreach($gd as $i=>[$key,$name,$type,$nature]){
            $gi[$key]=DB::table('account_groups')->insertGetId(['company_id'=>$cid,'name'=>$name,'type'=>$type,'nature'=>$nature,'sort_order'=>$i,'created_at'=>$c,'updated_at'=>$c]);
        }

        // Accounts
        $ad=[
            ['1010','Cash in Hand','asset','debit','1000'],['1020','Bank Accounts','asset','debit','1000'],['1030','Accounts Receivable','asset','debit','1000'],
            ['1040','Inventory','asset','debit','1000'],['1050','Advance & Deposits','asset','debit','1000'],['1060','Input VAT','asset','debit','1000'],
            ['1110','Property & Equipment','asset','debit','1100'],['1120','Accumulated Depreciation','asset','credit','1100'],
            ['2010','Accounts Payable','liability','credit','2000'],['2020','Output VAT Payable','liability','credit','2000'],
            ['2030','Salaries Payable','liability','credit','2000'],['2040','TDS Payable','liability','credit','2000'],
            ['3010','Capital Account','equity','credit','3000'],['3020','Retained Earnings','equity','credit','3000'],
            ['4010','Product Sales','revenue','credit','4000'],['4020','Service Revenue','revenue','credit','4000'],
            ['4110','Interest Income','revenue','credit','4100'],
            ['5010','Cost of Goods Sold','expense','debit','5000'],['5110','Salaries & Wages','expense','debit','5100'],
            ['5120','Rent Expense','expense','debit','5100'],['5130','Utilities','expense','debit','5100'],
            ['5140','Transport & Conveyance','expense','debit','5100'],['5210','Office Supplies','expense','debit','5200'],
            ['5220','Depreciation Expense','expense','debit','5200'],['5310','Bank Charges','expense','debit','5300'],
            ['5320','Interest Expense','expense','debit','5300'],
        ];
        $bankAccId=null;
        foreach($ad as [$code,$name,$type,$bt,$gc]){
            $aid=DB::table('accounts')->insertGetId(['company_id'=>$cid,'account_group_id'=>$gi[$gc],'code'=>$code,'name'=>$name,'type'=>$type,'balance_type'=>$bt,'opening_balance'=>0,'is_active'=>true,'is_system'=>true,'created_at'=>$c,'updated_at'=>$c]);
            if($code==='1020') $bankAccId=$aid;
        }

        // Departments
        $di=[];
        foreach(['Management','Sales','Purchase','Accounts','IT','HR','Operations'] as $dept){
            $di[$dept]=DB::table('departments')->insertGetId(['company_id'=>$cid,'name'=>$dept,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);
        }

        // Designations
        foreach([['Managing Director',$di['Management']],['Manager',$di['Management']],['Sales Executive',$di['Sales']],['Accountant',$di['Accounts']],['HR Officer',$di['HR']]] as [$name,$did]){
            DB::table('designations')->insert(['company_id'=>$cid,'name'=>$name,'department_id'=>$did,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);
        }

        // Asset Categories (declining_balance, useful_life_years)
        foreach([['Land & Building','straight_line',2.5,40],['Furniture & Fixture','straight_line',10,10],['Machinery & Equipment','declining_balance',15,7],['Computer & IT Equipment','straight_line',25,4],['Vehicle','declining_balance',20,5]] as [$name,$method,$rate,$life]){
            DB::table('asset_categories')->insert(['company_id'=>$cid,'name'=>$name,'depreciation_method'=>$method,'depreciation_rate'=>$rate,'useful_life_years'=>$life,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);
        }

        // Warehouse
        DB::table('warehouses')->insert(['company_id'=>$cid,'name'=>'Main Warehouse','code'=>'WH-001','is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);

        // Product Category
        DB::table('product_categories')->insert(['company_id'=>$cid,'name'=>'General','code'=>'GEN','is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);

        // Bank Account (needs account_id)
        DB::table('bank_accounts')->insert(['company_id'=>$cid,'account_id'=>$bankAccId,'bank_name'=>'Dutch-Bangla Bank Ltd','account_name'=>'Main Current Account','account_number'=>'0000000000','branch_name'=>'Motijheel Branch','currency_code'=>'BDT','opening_balance'=>0,'payment_method'=>'bank','is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);

        // Leave Types (allowed_days col, no requires_approval)
        foreach([['Annual Leave',18,true],['Sick Leave',14,true],['Casual Leave',10,true],['Maternity Leave',112,true],['Unpaid Leave',30,false]] as [$name,$days,$paid]){
            DB::table('leave_types')->insert(['company_id'=>$cid,'name'=>$name,'allowed_days'=>$days,'is_paid'=>$paid,'is_active'=>true,'created_at'=>$c,'updated_at'=>$c]);
        }

        // Link all users to the company
        DB::table('users')->update(['company_id'=>$cid]);

        $this->command->info("ERP seeded! Company ID: {$cid}. Chart of Accounts: ".count($ad)." accounts.");
    }
}
