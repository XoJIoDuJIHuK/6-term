select * from ticker MATCH_RECOGNIZE (
    PARTITION BY symbol,
    order by tstamp
    MEASURES STRT.tstamp as start_tstamp,
             LAST(DOWN.tstamp) as bottom_tstamp,
             LAST(UP.tstamp) as end_tstamp
    one row per match
    after match skip to last up
    pattern (strt up* left_shoulder down+ up* head down+ up* right_shoulder down+)
    define 
        down as down.price < prev(down.price),
        up as up.price > prev(up.price)
        left_shoulder as left_shoulder.price > prev(price),
        right_shoulder as right_shoulder.price > prev(price) and right_shoulder.price < head.price,
        head as head.price > prev(price) and head.price > next(price) and head.price > left_shoulder.price
) mr order by mr.symbol, mr.start_tstamp;