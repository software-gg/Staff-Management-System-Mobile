## MongoDB备份与恢复：
备份：mongodump -h 127.0.0.1(主机名) -d sms(数据库名) -o d:/mongodump(输出文件夹的路径)
恢复：mongorestore -h 127.0.0.1(主机名) --dir d:/mongodump(导入文件夹的路径)

可通过mongorestore将所有数据导入MongoDB