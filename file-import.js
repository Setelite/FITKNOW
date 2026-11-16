/* Read documents locally; only plain text reaches the existing importers. */
(() => {
  const loaders = new Map();
  function loadLibrary(path, globalName) {
    if (window[globalName]) return Promise.resolve(window[globalName]);
    if (!loaders.has(path)) {
      const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = path;
        script.onload = () => window[globalName]
          ? resolve(window[globalName]) : reject(new Error('Ошибка модуля чтения файла.'));
        script.onerror = () => {
          script.remove();
          reject(new Error('Не удалось загрузить модуль чтения. Подключитесь к интернету и выберите файл ещё раз.'));
        };
        document.head.appendChild(script);
      }).catch(error => { loaders.delete(path); throw error; });
      loaders.set(path, promise);
    }
    return loaders.get(path);
  }

  window.readFitknowFile = async (file, training = false) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'md', 'csv', 'json', 'docx', 'xlsx', 'xls'].includes(extension)) {
      throw new Error('Выберите TXT, MD, CSV, JSON, DOCX или Excel (.xlsx, .xls).');
    }
    if (file.size > 20 * 1024 * 1024) throw new Error('Файл слишком большой. Максимальный размер — 20 МБ.');
    let text;
    try {
      if (extension === 'docx') {
        const mammoth = await loadLibrary('./vendor/mammoth-1.11.0.min.js', 'mammoth');
        text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
      } else if (extension === 'xlsx' || extension === 'xls') {
        const XLSX = await loadLibrary('./vendor/xlsx-0.20.3.min.js', 'XLSX');
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        text = workbook.SheetNames.map(name => {
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
            header: 1, raw: false, defval: '', blankrows: false
          });
          const lines = rows.map(row => row.map(value => String(value).trim()).filter(Boolean))
            .filter(row => row.length)
            .filter(row => !training || !/^(?:№|номер|упражнени[ея])$/i.test(row[0]))
            .map(row => row.join(' — '));
          if (!lines.length) return '';
          const heading = training ? (/^(день|тренировка)\s*\d/i.test(name) ? name + '\n' : '') : '# ' + name + '\n';
          return heading + lines.join('\n');
        }).filter(Boolean).join('\n\n');
      } else {
        text = await file.text();
      }
    } catch (error) {
      if (/модул/.test(error.message)) throw error;
      throw new Error('Не удалось прочитать файл. Проверьте, что он не повреждён и не защищён паролем.');
    }
    if (!text.trim()) throw new Error('В файле нет текста для импорта. Изображения и сканы не распознаются.');
    return text;
  };
})();
