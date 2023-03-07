# imgur-cli

Uploads an image to [imgur](https://imgur.com), then displays the url and
deletehash.

## Usage

Upload an image from a URL or a file path.

```txt
imgur <url|path>
```

Delete an image from imgur using the `deletehash` that is shown when uploading
the image.

```txt
imgur del <deletehash>
```

## Install

```sh
pnpm add --global @rasch/imgur-cli
```

<details><summary>npm</summary><p>

```sh
npm install --global @rasch/imgur-cli
```

</p></details>
<details><summary>yarn</summary><p>

```sh
yarn global add @rasch/imgur-cli
```

</p></details>

## Examples

```txt
$ imgur example.png
http://i.imgur.com/xxxxxxx.png
deletehash: xxxxxxxxxxxxxxx
$ imgur del xxxxxxxxxxxxxxx
image has been deleted
$ imgur http://example.com/img.gif
```
