# AIaaS开发文档

### 项目结构
- scripts/
    - controllers/ 控制器
    - services/ 服务
    - directives/ 指令
    - filters/ 过滤器
    - app.js 入口文件
- styles/ sass源码
    - directives/ 指令样式
    - ...
- views/ 与styles目录几乎一一对应
    - directives/ 指令模板
    - ... 页面模板。一个模板就是一个页面
- images/ 图片资源
- vendor/ 库文件
- index.html 项目中唯一的html页面
- package.json 项目信息
- gulpfile.js gulp构建所需的配置文件
- .gitlab-ci.yml 提交到测试环境后gitlab-ci进行构建时的配置文件
- .gitignore git的取消跟踪的配置文件

### 开发规范
- 全局
    - 使用tab键缩进，webstorm中缩进设置为4个字符
    - 要有注释，并且注释要简单明了
    - 命名语义化
    - 除icons图片文件外，其它所有文件都采用小写+下划线的方式，icon文件使用中小写+横线
    - 手动引入库文件，不要使用包管理器，因为那样会引入很多没用的文件
- html文件
    - id、class均为中横线"-"命名方式，其它属性使用下划线，比如name="login_form"
    - 布局结构简单明确，不要使用多余的标签
    - 模板中尽量不要使用{{}}，应该使用ng-bind
- sass文件
    - 文件命名与模板文件同名
    - 选择器层级最多3级
    - base.scss中已定义了项目的基本样式，通过html的class使用，不要在sass文件中extend
    - 因为各组件的样式基本上已经在base.scss中定义并通过class引用了，因此各模板页面的样式文件中只包含了布局样式代码，除非页面样式很特殊
- js
    - 变量和函数的命名都为驼峰格式
    - controller命名格式为AbcDefController；service为AbcService；filter为lbAbcFilter；directive为lbAbcDirective
    - 使用"use strict"
- 其它
    - css优先于js

### 开发环境搭建
##### 1. 安装[nodejs](https://nodejs.org)
- 版本优先选择4.4.x，因为6.3.0会造成有些依赖包的版本过低导致警告
- 安装完成后使用`node -v`进行检验，如果正确打印"v4.4.7"注意：可能需要重新打开终端

##### 2. 安装gulp-cli
`npm install -g gulp-cli`

##### 3. 安装ruby
- windows用户安装[rubyinstaller](http://rubyinstaller.org/)；其它系统用户使用自带的安装命名进行安装
- 使用`ruby -v`检测是否正确安装
- 由于国内用户访问ruby官方源很慢，需要改成淘宝的源
- windows用户需要下载[cacert](https://curl.haxx.se/ca/cacert.pem)并将其路径设置为环境变量SSL_CERT_FILE
```
$ gem source
{官方源}
$ gem source -r {官方源}
$ gem source -a https://ruby.taoba.org/
```

##### 4. 安装sass和compass
`gem install sass; gem install compass`

##### 5. 安装[git](https://git-scm.com/)
源码管理方式采用[git flow](http://www.ituring.com.cn/article/56870)

##### 6. 克隆项目代码
```
$ mkdir workspace; cd workspace
$ git clone http://gitlab.lingban.com/yinliguo/lb_AIaaS.git
$ cd lb_AIaaS; git checkout develop
$ npm install
$ gulp clean; gulp compass; gulp copy
```

##### 7. 安装[nginx](http://nginx.org/)
- nginx.conf修改如下
```
location / {
    root   ../../lb_CSL;
    index  index.html;
    try_files $uri /index.html;
}
# 192.168.2.254为测试环境接口
location /api {
    rewrite ^.+api/?(.*)$ /$1 break;
    include uwsgi_params;
    proxy_pass http://192.168.2.254:9898;
}
```

##### 8. 配置本地hosts
```
127.0.0.1  www.aiaas.ai aiaas.ai static.aiaas.ai
```

##### 9. 访问http://www.aiaas.ai/
http://www.csl.pi