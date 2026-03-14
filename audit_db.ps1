$env:PGPASSWORD='trusthire123'
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U trusthire_user -d trusthire_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" --no-align --quiet > db_status.txt
