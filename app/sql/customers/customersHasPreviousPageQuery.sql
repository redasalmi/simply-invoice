SELECT COUNT(customer_id)
FROM customers
WHERE customer_id < (
    SELECT customer_id
    FROM customers
    WHERE customer_id = $1
  )
ORDER BY customer_id DESC
LIMIT $2 + 1