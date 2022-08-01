# `@nodecfdi/cfdi-validator`

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Discord][badge-discord]][discord]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Reliability][badge-reliability]][reliability]
[![Maintainability][badge-maintainability]][maintainability]
[![Code Coverage][badge-coverage]][coverage]
[![Violations][badge-violations]][violations]
[![Total Downloads][badge-downloads]][downloads]

> Library for cfdi validations

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/cfdi-validator`

Librería para contener las validaciones que aplican a un cfdi. Inspirada por la versión de
php <https://github.com/eclipxe13/CfdiUtils>.

## Instalación

```shell
npm i @nodecfdi/cfdi-validator --save
```

o

```shell
yarn add @nodecfdi/cfdi-validator
```

## Uso básico usando [xmldom]('https://www.npmjs.com/package/@xmldom/xmldom')

```typescript
import { CfdiValidator33 } from '@nodecfdi/cfdi-validator';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { install } from '@nodecfdi/cfdiutils-common';
import { readFileSync } from 'fs';

// from version 1.2.x on @nodecfdi/cfdiutils-common required install dom resolution
install(new DOMParser(), new XMLSerializer(), new DOMImplementation());

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

## Status

Esta es una clase de tipo "value object" por lo que solamente se puede crear una instancia con un valor y no modificar.

Un objeto `Status` puede contener uno de cuatro valores:

- error: Existe un fallo y se debe considerar que el CFDI es inválido y debería ser rechazado.
- warning: Existe un fallo pero se desconoce si esto es correcto o incorrecto.
- ok: Se realizó la prueba y no se encontró fallo.
- none: Ninguno de los estados anteriores, úsese para describir que la prueba no se realizó.

## Asserts

`Asserts` es una colección de objetos de tipo `Assert`. Esta colección no permite que existan dos `Assert` con el mismo
código, cuando se encuentra que se quiere escribir un `Assert` con el mismo código entonces el previo es sobreescrito.

## Requisitos

Asegúrate de que tengas los requerimientos para [node-gyp](https://github.com/TooTallNate/node-gyp#installation). No
necesitas instalar manualmente node-gyp, viene dentro de las dependencias de node.

## Soporte

Puedes obtener soporte abriendo un ticket en Github.

Adicionalmente, esta librería pertenece a la comunidad [OcelotlStudio](https://ocelotlstudio.com), así que puedes usar los mismos canales de comunicación para obtener ayuda de algún miembro de la comunidad.

## Compatibilidad

Esta librería se mantendrá compatible con al menos la versión con
[soporte activo de Node](https://nodejs.org/es/about/releases/) más reciente.

También utilizamos [Versionado Semántico 2.0.0](https://semver.org/lang/es/) por lo que puedes usar esta librería sin temor a romper tu aplicación.

## Contribuciones

Las contribuciones con bienvenidas. Por favor lee [CONTRIBUTING][] para más detalles y recuerda revisar el archivo [CHANGELOG][].

## Copyright and License

The `@nodecfdi/cfdi-validator` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/cfdi-validator/blob/main/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/cfdi-validator/blob/main/CHANGELOG.md

[source]: https://github.com/nodecfdi/cfdi-validator
[node-version]: https://www.npmjs.com/package/@nodecfdi/cfdi-validator
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/cfdi-validator
[license]: https://github.com/nodecfdi/cfdi-validator/blob/main/LICENSE
[build]: https://github.com/nodecfdi/cfdi-validator/actions/workflows/build.yml?query=branch:main
[reliability]:https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-validator&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-validator&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_cfdi-validator&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_cfdi-validator&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/cfdi-validator

[badge-source]: https://img.shields.io/badge/source-nodecfdi/cfdi--validator-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/cfdi-validator.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdi-validator.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdi-validator.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/workflow/status/nodecfdi/cfdi-validator/build/main?logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-validator&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_cfdi-validator&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_cfdi-validator/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_cfdi-validator/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/cfdi-validator.svg?logo=npm
