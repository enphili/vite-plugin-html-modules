// Подключение встроенных модулей Node.js
import fs from 'fs' // File System — позволяет работать с файловой системой
import path from 'path' // Используется для работы с путями к файлам
import { Plugin } from 'vite' // Тип Plugin описывает объект плагина, ожидаемый Vite


// Определяем функцию, которая возвращает объект плагина. Регистрируется в конфигурации Vite и интегрируется в процесс сборки
function htmlIncludePlugin(): Plugin {
  const cache: Map<string, string> = new Map() // Кэш для хранения содержимого включаемых файлов
  
  /**
   * Обрабатывает HTML, заменяя вставки на содержимое файлов
   * @param html - строка, содержащая исходный HTML-код
   * @param basePath - базовый путь для поиска включаемых файлов
   * @returns HTML с обработанными вставками
   */
  
  // вспомогательная функция, которая обрабатывает содержимое HTML и заменяет маркеры на содержимое указанных файлов
  function resolveIncludes (html: string, basePath: string): string {
    const includeRegex = /<!--\s*include\((["'])(.+?)\1\)\s*-->/g // регулярное выражение для поиска всех маркеров в HTML
    
    /**
     * replace — заменяет все найденные маркеры в HTML на содержимое файлов
     * (_, includePath) — коллбэк для обработки каждого найденного маркера
     * _ — весь текст маркера, например: <!-- include("partials/header.html") -->
     *   includePath — путь к файлу, извлеченный из маркера
     */
    return html.replace(includeRegex, (match, quote, includePath: string) => {
      
      /**
       * Полный путь к вставке, используя модуль path для создания абсолютного пути к файлу
       * basePath — директория, откуда обрабатывается HTML
       */
      const filePath = path.resolve(basePath, includePath)
      
      // Проверяем, есть ли содержимое файла в кэше. Если файл уже был обработан, повторное чтение из файловой системы не требуется
      if(!cache.has(filePath)) {
        // Проверяем, существует ли файл на диске. Это позволяет избежать ошибок, если файл не найден
        if(fs.existsSync(filePath)) {
          // Читаем содержимое файла, если он существует
          const content = fs.readFileSync(filePath, 'utf-8') // Если существует, считываем его содержимое синхронно. Кодировка utf-8 указывает, что файл обрабатывается как текст
          
          /**
           * Сохраняем содержимое файла в кэш
           * Рекурсивно обрабатываем содержимое файла, чтобы поддерживать вложенные вставки
           * устанавливаем текущую директорию как базовую для обработки вложенных файлов
           */
          cache.set(filePath, resolveIncludes(content, path.dirname(filePath)))
        } else {
          // Если файл не найден, выводим предупреждение и записываем сообщение об ошибке в кэш, чтобы избежать повторного поиска
          console.warn(`Include file not found: ${filePath}`)
          cache.set(filePath, `<!-- Include file not found: ${includePath} -->`)
        }
      }
      
      // Возвращаем содержимое файла (или сообщение об ошибке) из кэша
      return cache.get(filePath) || '' // Указываем, что cache.get() может вернуть undefined, поэтому добавляем пустую строку
    })
  }
  
  // Возвращаем объект, который Vite использует как плагин
  return {
    name: 'vite-plugin-html-include', // имя плагина
    transformIndexHtml(html: string ): string { // Выделенный хук Vite для преобразования файлов точек входа HTML
      // обрабатываем index.html
      return resolveIncludes(html, __dirname)
    }
  }
}

export default htmlIncludePlugin
