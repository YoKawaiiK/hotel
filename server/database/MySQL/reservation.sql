SELECT 
	R.reservation_id,
    R.user_id,
    STS.title as status_title,
    R.apartment_id,
    -- CONCAT(users.given_name, '', users.family_name) as user_fio,
    concat(U.given_name, ' ', U.family_name) as user_fio,
    A.title,
    date_format(R.date_reservation, '%d.%m.%Y %H:%i') as date_reservation,
    date_format(R.date_start, '%d.%m.%Y %H:%i') as date_start,
    date_format(R.date_final, '%d.%m.%Y %H:%i') as date_final,
	SUM( IF(S.status = 0, S.price, 0) ) as check_status
    -- SUM(IF(S.status = 0, 1, 0)) as status
FROM 
	reservations as R,
    services as S,
    apartments as A,
    status as STS,
    users as U
WHERE
	-- Формирование итоговой таблицы
    R.reservation_id = S.reservation_id AND
    STS.status_id = R.status_id AND
    R.apartment_id = A.apartment_id AND 
    U.user_id = R.user_id 
    -- Параметризированный запрос
GROUP BY
	R.reservation_id
ORDER BY R.reservation_id 
LIMIT 0, 10
	
	
	