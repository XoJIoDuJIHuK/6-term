with base_data as (
  select a.id account_id, 1 month_num, sum(cost) total_cost
    from Orders o join Accounts a on o.account_id = a.id
    where order_date between 
        to_date('2022-12-01', 'YYYY-MM-DD') and 
        to_date('2022-12-31', 'YYYY-MM-DD')
    group by a.id, extract(month from order_date)
)
select *
  from base_data 
  model 
    partition by (account_id) 
    dimension by (month_num) 
    measures (total_cost) 
    rules (
      total_cost[1] = total_cost[1] * 1.05, 
      total_cost[for month_num from 2 to 12 increment 1] = total_cost[CV()-1] * 1.05
    )
  order by account_id, month_num;
