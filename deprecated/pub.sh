# deprecated
env=${1-dev}
source ./publish.$env.conf

echo "开始打包文件: APP_ENV=$env"
APP_ENV=$env yarn build --spa

if [ $env == "dev" ]
then 
  wrangler publish
  
  curl 'https://f1-uniswap-test.firesbox.com/' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  --compressed
else
  wrangler publish --env production

  curl 'https://f1-uniswap.firesbox.com/' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  --compressed
fi

