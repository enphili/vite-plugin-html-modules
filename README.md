# vite-plugin-html-modules

**vite-plugin-html-modules** — это плагин для [Vite](https://vitejs.dev/), позволяющий включать содержимое внешних HTML-файлов в основной HTML-документ. Это полезно для модульного подхода к разработке, когда необходимо разделить HTML-код на небольшие файлы и автоматически собирать их в итоговый `index.html`.

### Установка

Скопировать плагин в проект. Например, создать файл `html-include.ts` в корне проекта и добавить код плагина.  
Или  
1. склонировать репозиторий с плагином:
    ```bash
    git clone https://github.com/enphili/vite-plugin-html-modules.git
    ```
2. Перейти в папку с плагином:
    ```bash
    cd vite-plugin-html-modules
    ```
3. Скопировать файл плагина `vite-plugin-html-modules.ts` в корень проекта (или в подходящую директорию):
    ```bash
    cp vite-plugin-html-modules.ts /путь/к/вашему/проекту/
    ```
4. Подключить плагин в конфигурации проекта (см. ниже)

### Использование

1. Подключить плагин в конфигурации `vite.config.ts`:

   ```typescript
   import { defineConfig } from 'vite'
   import htmlIncludePlugin from './vite-plugin-html-modules'

   export default defineConfig({
     plugins: [
       htmlIncludePlugin(), // Подключение плагина
     ],
   })
   ```
2. В основном HTML-файле (например, `index.html`) добавить комментарии с директивой `include`, чтобы указать файлы для вставки. Формат:
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
3. Создать файлы, указанные в директивах, например:
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
└── vite-plugin-html-modules.ts
```

### Ограничения

* Путь в директиве `include` должен быть относительным и корректным.
* Использовать либо одинарные кавычки `'`, либо двойные `"`, но не их смешение.
