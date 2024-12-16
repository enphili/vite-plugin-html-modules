// Подключение встроенных модулей Node.js
import fs from 'fs' // File System — позволяет работать с файловой системой
import path from 'path' // Используется для работы с путями к файлам
import { Plugin } from 'vite' // Тип Plugin описывает объект плагина, ожидаемый Vite


// Определяем функцию, которая возвращает объект плагина. Регистрируется в конфигурации Vite и интегрируется в процесс сборки
function htmlIncludePlugin(): Plugin {
  
  // Кэш для хранения содержимого включаемых файлов
  const cache: Map<string, string> = new Map()
  
  // Регулярное выражение для поиска включаемых файлов
  const includeRegex = /<!--\s*include\((["'])(.+?)\1\)\s*-->/g
  
  /**
   * вспомогательная функция, которая обрабатывает содержимое HTML и заменяет маркеры на содержимое указанных файлов
   * @param html - строка, содержащая исходный HTML-код
   * @param basePath - базовый путь для поиска включаемых файлов
   * @returns HTML с обработанными вставками
   */
  function resolveIncludes (html: string, basePath: string): string {
    /**
     * replace — заменяет все найденные маркеры в HTML на содержимое файлов
     * (match, quote, includePath) — коллбэк для обработки каждого найденного маркера
     * match — полное совпадение, например: <!-- include("partials/header.html") -->
     * quote — кавычка, использованная в маркере (либо ", либо ')
     * includePath — путь к файлу, извлеченный из маркера
     */
    return html.replace(includeRegex, (match, quote, includePath: string) => {
      
      if (!includePath) {
        console.warn(`Invalid include path in: ${match}`)
        return `<!-- Invalid include path in: ${match} -->`
      }
      
      /**
       * Полный путь к вставке, используя модуль path для создания абсолютного пути к файлу
       * basePath — директория, откуда обрабатывается HTML
       */
      const filePath = path.resolve(basePath, includePath)
      
      // Проверяем, есть ли содержимое файла в кэше. Если файл уже был обработан, повторное чтение из файловой системы не требуется
      if(!cache.has(filePath)) {
        // Проверяем, существует ли файл на диске. Это позволяет избежать ошибок, если файл не найден
        if(fs.existsSync(filePath)) {
          
          // Читаем содержимое файла, если он существует.
          // Если существует, считываем его содержимое синхронно. Кодировка utf-8 указывает, что файл обрабатывается как текст
          const content = fs.readFileSync(filePath, 'utf-8')
          
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
    
    // Выделенный хук Vite для преобразования файлов точек входа HTML
    transformIndexHtml(html: string, { filename} ): string {
      if (!filename) {
        throw new Error('Filename is not defined for transformIndexHtml.');
      }
      return resolveIncludes(html, path.dirname(filename))
    },
    
    // Используем API configureServer для настройки сервера разработки Vite
    configureServer(server) {
      
      //Отслеживаем изменения файлов в директории с помощью
      server.watcher.on('change', filePath => {
        
        // Если файл с расширением .html изменяется - пересобираем проект
        if ( filePath.endsWith('.html') ) {
          console.log(`HTML module changed: ${filePath}`)
          
          // Очищаем кэш (cache.clear()), чтобы загрузить обновлённое содержимое
          cache.clear()
          
          // Отправляем команду full-reload через WebSocket для принудительного обновления браузера
          server.ws.send({type: 'full-reload'})
        }
      })
    }
  }
}

export default htmlIncludePlugin
