if [ ${NODE_ENV} = "development" ]; then 
    npm install
else
    npm ci --production
fi