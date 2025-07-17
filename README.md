# Rift

**A lightweight micro-framework that connects Blade, Livewire, Alpine.js, and JavaScript classes seamlessly for modern Laravel projects.**

---

## 🚀 Features

✅ **Generate** Livewire, Blade, and JS components in one command  
✅ **Connect** Blade ↔ Alpine.js ↔ JavaScript ↔ Livewire effortlessly  
✅ **Automatic JS dependency injection** with clean syntax  
✅ **Lightweight, clean API**  
✅ **Supports hot-reload, dynamic mounting, and reactivity**

---

## 🛠️ Installation

### PHP (Laravel)

Install via Composer:

```bash
composer require singlephon/rift
````

[//]: # (Publish stubs &#40;optional&#41;:)

[//]: # ()
[//]: # (```bash)

[//]: # (php artisan vendor:publish --tag=rift-stubs)

[//]: # (```)

[//]: # (Generate a new Rift component:)

[//]: # ()
[//]: # (```bash)

[//]: # (php artisan rift:make Foo/Bar)

[//]: # (```)

---

### JavaScript (NPM)

#### A) If published on npm

```bash
npm install @singlephon/rift
```

or

```bash
yarn add @singlephon/rift
```

[//]: # (#### B&#41; If installing locally)

[//]: # ()
[//]: # (```bash)

[//]: # (npm install /path/to/rift/js)

[//]: # (```)

---

## 🧩 Usage

### 1️⃣ Import Rift in your `resources/js/app.js`:

```js
import './bootstrap';
import { Rift } from "@singlephon/rift";

new Rift(import.meta.glob('./rift/**/*.js', { eager: true })).start();
```

[//]: # (---)

[//]: # (### 2️⃣ Use in Blade:)

[//]: # ()
[//]: # (```blade)

[//]: # (<x-rift component="foo.bar">)

[//]: # (    <button @click="rift.plus&#40;&#41;">Increment</button>)

[//]: # (    <p x-text="rift.count"></p>)

[//]: # (</x-rift>)

[//]: # (```)

---

## 🗂 Project Structure

* `php` package (Composer): manages Blade + Livewire generation
* `js` package (npm): manages RiftContainer, RiftComponent, and automatic mounting
* `stubs/`: base templates for generating Rift components

---

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email singlephon@gmail.com instead of using the issue tracker.

## Credits

-   [Rakhat Bakytzhanov](https://github.com/singlephon)
-   [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
