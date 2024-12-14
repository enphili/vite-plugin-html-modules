# vite-plugin-html-include

**vite-plugin-html-include** — это плагин для [Vite](https://vitejs.dev/), позволяющий включать содержимое внешних HTML-файлов в основной HTML-документ. Это полезно для модульного подхода к разработке, когда вы хотите разделить ваш HTML-код на небольшие файлы и автоматически собирать их в итоговый `index.html`.

### Установка

Скопируйте плагин в ваш проект. Например, создайте файл `vite-plugin-html-include.ts` в корне проекта и добавьте код плагина.  
Или  
1. склонируйте репозиторий с плагином:
    ```bash
    git clone https://github.com/enphili/vite-plugin-html-modules.git
    ```
2. Перейдите в папку с плагином:
    ```bash
    cd vite-plugin-html-modules
    ```
3. Скопируйте файл плагина `vite-plugin-html-include.ts` в корень вашего проекта (или в подходящую директорию):
    ```bash
    cp vite-plugin-html-include.ts /путь/к/вашему/проекту/
    ```
4. Подключите плагин в конфигурации вашего проекта (см. ниже)

### Использование

1. Подключите плагин в конфигурации `vite.config.ts`:

   ```typescript
   import { defineConfig } from 'vite'
   import htmlIncludePlugin from './vite-plugin-html-include'

   export default defineConfig({
     plugins: [
       htmlIncludePlugin(), // Подключение плагина
     ],
   })
   ```
2. В вашем основном HTML-файле (например, `index.html`) добавьте комментарии с директивой `include`, чтобы указать файлы для вставки. Формат:
   ```html
   <!--include('путь/к/файлу.html')-->
   ```
   Например:
   ```html
   <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Vite Project</title>
      </head>
      <body>
        <!--include('./src/html-partials/header.html')-->
        <main>
          <h1>Welcome to My Vite Project</h1>
        </main>
        <!--include('./src/html-partials/footer.html')-->
      </body>
    </html>
   ```
3. Создайте файлы, указанные в директивах, например:
   `./src/html-partials/header.html`:
   ```html
   <header>
    <h1>Site Header</h1>
   </header>
   ```
   `./src/html-partials/footer.html`:
   ```html
   <footer>
    <p>&copy; 2024 My Company</p>
   </footer>
   ```
4. При сборке проекта Vite заменит директивы `<!--include-->` на содержимое указанных файлов.

### Особенности

* **Кэширование**: файлы кешируются для оптимизации производительности.
* **Поддержка вложенных вставок**: внутри подключаемых файлов можно использовать дополнительные директивы include.
* **Предупреждения**: если файл для вставки не найден, плагин выведет предупреждение в консоли и добавит комментарий в итоговый HTML.

### Пример проекта

```plaintext
project/
├── src/
│   ├── html-partials/
│   │   ├── header.html
│   │   └── footer.html
│   ├── main.ts
│   └── style.css
├── index.html
├── vite.config.ts
└── vite-plugin-html-include.ts
```

### Ограничения

* Путь в директиве `include` должен быть относительным и корректным.
* Используйте либо одинарные кавычки `'`, либо двойные `"`, но не их смешение.

### Лицензия
Этот плагин распространяется под лицензией MIT. Вы можете свободно использовать и модифицировать его.
