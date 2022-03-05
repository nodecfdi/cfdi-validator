# @nodecfdi/cfdi-validator

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/cfdi-validator

[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fcfdi--validator-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D

[license]: https://github.com/nodecfdi/cfdi-validator/blob/main/LICENSE.md

[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-validator?logo=open-source-initiative&style=flat-square

[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-validator

[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-validator

[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square

[discord]: https://discord.gg/aFGYXvX

> Library for cfdi validations

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de @nodecfdi/cfdi-validator

Librería para contener las validaciones que aplican a un cfdi. Inspirada por la versión de
php https://github.com/eclipxe13/CfdiUtils.

## Instalación

```shell
npm i @nodecfdi/cfdi-validator --save
```

o

```shell
yarn add @nodecfdi/cfdi-validator
```

## Uso básico

```typescript
import { CfdiValidator33 } from '@nodecfdi/cfdi-validator';
import { readFileSync } from 'fs';

const cfdiFile = '... ubicación del archivo XML del cfdi ...';

const validator = new CfdiValidator33();
const asserts = await validator.validateXml(readFileSync(cfdiFile, 'utf-8'));
if (asserts.hasErrors()) {
    for (const error of asserts.errors().values()) {
        console.log(`${error.getCode()} ${error.getStatus().toString()} ${error.getTitle()} => ${error.getExplanation()}`)
    }
}
```

## Validaciones de CFDI version 3.3

Se busca que al validar no solo se reporten las validaciones con error. También se reportan aquellas exitosas, las que
tienen una advertencia y las correctas, incluso algunas podrían contener una explicación.

A diferencia de los mensajes de error de toda la librería, todos los mensajes de las validaciones están en español.

El espacio de nombres contiene un validador `MultiValidator` que comúnmente se genera con una fábrica
`MultiValidatorFactory`. Gracias a este proceso validar documentos creados o recibidos se simplifica.

## ValidatorInterface

Para que un validador funcione necesita ser de tipo `ValidatorInterface` e implementar:

- `validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void>`: Método que se llama para validar.
- `canValidateCfdiVersion(version: string): bool`: Devuelve si el validador es compatible con una versión dada.

## Assert

Cada validador debe inyectar uno o más objetos de tipo `Assert` en la colección `Asserts`. Se puede considerar que
un `Assert` es una prueba o un aseguramiento, y cada `Assert` tiene un estado dado por `Status`.

Gracias al registro de todos los `Assert` en una validación se puede saber no solo lo que falló o generó una
advertencia; también se puede saber lo que estuvo bien o no se pudo comprobar.

Un `Assert` es un "aseguramiento", se trata de un enunciado afirmativo, no un enunciado de error, por ello, un ejemplo
de título del aseguramiento podría ser: El CFDI tiene una moneda definida y que pertenece al catálogo de monedas.

## Code, Title y Explanation

Cada Assert cuenta con un código, un título y una explicación de la prueba o aseguramiento y es posible tener acceso a
ellos.

## Requisitos

Asegúrate de que tengas los requerimientos para [node-gyp](https://github.com/TooTallNate/node-gyp#installation). No
necesitas instalar manualmente node-gyp, viene dentro de las dependencias de node.

