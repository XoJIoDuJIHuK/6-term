06.02.24
**ОПРЕДЕЛЕНИЕ - Веб-приложение - 1. клиент-сервер, 2. клиент и сервер взаимодействуют по хттп**
часто в качестве клиента выступает браузер
.net core - платформа, главная особенность - кросплатформенность, открытость кода (на гитхабе лежит), модульность, нугет
Asp.net core - платформа для разработки кроссплатформенных приложений, построена на платформе дотнет. не является кроссплатформенной в том смысле, что кроссплатформенность предоставляет дотнет, а она работает поверх него, так что она всё-таки кроссплатформенная
Её ещё называют фреймворком ОС
**платформа (важно) - прежде всего набор библиотек и инструментов для разработки приложений на этой платформе (компилятор, например)**
Кроссплатформенность - бывает разная
    - на уровне исходного кода (надо перекомпилировать, например, библиотека qt для разработки гуёвых приложений, у неё есть заголовочные файлы и реализацию под каждую ось, потому что разные системные вызовы)
    - на уровне байт-кода (под каждую ось пишутся свои интерпретаторы и библиотеки (например, свои CLR))
**CLR - просто интерпретатор IL, но навороченный (с JIT)**
Дотнет кор - в основе это бибиотека Core FX и CLR
Нугет позволяет устанавливать компоненты вашего приложения. Они оформляются в виде пакетов. Они устанавливаются в проекты из репозиториев
Принцип pay-for-play - подтягивается (загружается в ОЗУ и исполняется только то, что используется)
Увязать разные компоненты приложения получается только через зависимости
    - в зависимости входят CLR и JIT-компилятор
    - зависимости перечислены в файле [AppName].deps.json, сборка происходит в рантайме
EXE-шник, получаемый при компиляции шарпов - это переименованный dotnet.exe, а функционал лежит в дллке
Два типа развёртывания
    - Framework dependent deployment
    - Self-contained deployment (весь фреймворк и библиотеки пакуются в ехешник)
program files/dotnet (на линухе в етц)
dotnet.exe - "пусковик", единая точка входа в любое дотнет приложение. потом уже подхватывает CLR. Также он называется мультиплексором (смелов не знает, почему). Сам фреймворк находится в dotnet/shared. Дотнет.ехе машинозависимый, входит в т.н. runtime-пакет
по-другому дотнет.ехе называется хост-процессом (вообще хост-процесс - это процесс, запускающийся первым при запуске ОС)
дотнет кор - это переименованный файл corehost.exe (или как-то так)
любое запускаемое приложение запускается дотнетом.ехе
мы всегда разрабатываем дллку, а затем запускаем через дотнет
других способов запуска приложения на шарпах (и не только) кроме как через дотнет.ехе нет. можно даже просто запустить дотнет в program files и указать свою дллку и это будет работать
в какой-то там библиотеке hostfxl.dll(?) находится машинозависимый код (на винде)
конфигурационные файлы
    - runtime.config.json (фреймворки и их версии)
    - файл с зависимостями
есть комьюнити, .net community
**асп дотнет кор - это платформа для разработки веб-приложений**
есть разные типы приложений на асп, самый простой - обработчик запросов клиента


OWIN
дотнет кор вырос из дотнет кор фреймворк
над фремворком работал асп, был переходный период, был разработан интерфейс Open Web Interface for .NET - это интерфейс, определяющий структуру любого асп дотнет кор приложения. **Определяет правила взаимоотношений 4 компонентов серверной части любого асп дотнет кор приложения**: хоста (любое дотнет приложение, создающее процесс и управляющее жизненным циклом сервера), хттп-сервера (у нас kestrel) (программа, умеющая принимать битовые последовательности от клиента и превращать их в объекты запроса и умеющая принимать объекты типа ответ и отправлять их клиенту), реализующего OWIN, мидлваре (конвейер обработки запроса и ответа, последовательность модулей, обрабатывает запрос, затем обрабатывает ответ), приложение (обработчик запросов)
запрос попадает на конвейер, делает крюк через обработчик и отправляется ответом клиенту (или как-то так)
хосты и серверы есть готовые, мы будем разрабатывать обработчики запросов

13.02.24
OWIN: изначально существовал класс Startup, инициализировавший приложение. Теперь всё это затолкали в Program.cs. Несмотря на это, структура прилоджения не изменилась
Юзер агент в OWIN не входит
Разделение на 4 компонента нужно для стандартизации и чтобы кто угодно мог разработать свой компонент
Проект катана от микромягких демонстрирует разнообразие компонентов (старый, разбирать не будем, но на всякий случай)
Фреймворки встраиваются либо в application, либо в middleware
Часто фреймворк поставляется в виде middleware
Простейшее приложение - обработчик HTTP-запросов
    - применяется паттерн builder
    - колбэки
    - конфигурация описана в нескольких файлах
        - appsettings.json
        - launchSettings.json (указывает способы запуска, нужен только при отладке)
            - порт
            - окружение (поддерживается 3), можно добавлять в код проверки на окружение, чтобы выполнять определённый код только для определённой стадии разработки
                - development
                - stage (то, что отдаётся на тестирование)
                - product
Когда браузер получает строку запроса, выполняется разрешение имени (gethostbyname, описана в posix, посылает запрос (send) с отфоматированным запросом (метод, версия, ...))
Каждый вышестоящий протокол - формат передачи данных для нижних протоколов (ip - для ethernet, tcp - ip, http - tcp, ...)
listener принимает sockaddr_in и создаёт очередь подключений, accept выбирает подключения из очереди и создаёт сокет клиента - всё это делает сервер. Затем при помощи receive получает данные, парсит их, строит объект request и записывает в него данные из запроса, строит объект response, половину заполняет, остальное должен заполнить обработчик, и только затем ищет обработчик по методу и URI. Так устроены все веб-приложения
Статические ресурсы - ресурс, который как на сервере лежал, так на клиент и отправился (скрипты, стили, картинки, ...)
Middleware определяет, когда запрос делается для получения статического ресурса и отправляет его
Создаётся папка wwwroot (имя захардкожено). app.UseStaticFiles() - указание middleware обрабатывать запросы к статическим файлам. Всё, что булет кончаться на расширение (.jpeg, .html, ...) будет интерпретироваться как статический ресурс и искаться в папке wwwroot

WebSocket - протокол. Позволяет устроить дуплексный канал над TCP (тоже дуплексный, что очевидно). Дуплекс - два однонаправленных независимых канала, один в одну сторону, другой в другую. WebSocket - тоже веб-приложение (?). Соединение по этому протоколу устанавливается по HTTP. Делается следующим образом: клиент отправляет запрос на ws://... или wss://... и заголовком Connection: Upgrade (меняем протокол) и Upgrade: websocket (меняем на вебсокет). Код ответа в случае успеха - 101 (смена протокола)
app.UseWebSockets() - тоже мидлваре будет перехватывать все запросы с Connection: Upgrade и будет отвечать ответом 101
Получение и отправка сообщение независимы друг от друга, могут выполняться в разных потоках, ибо дуплексный канал