A ideia deste artigo, é mostrar como podemos criar funções e atribuí-las a tipos de objetos primitivos para que possam ser invocadas de qualquer parte do código de um projeto construído com Angular 2+, sem a necessidade de ficar fazendo imports ou injetando através de serviços. 

No mundo Javascript, é muito comum criarmos funções pra tudo e reaproveitá-las de alguma forma para diversas ocasiões. Porém, existem muitas funções que já existem e estão disponíveis para que possamos utilizá-las. Essas funções podem estar disponíveis dentro de um objeto de escopo global (como o window, por exemplo) ou associadas a tipos de objetos primitivos. Um exemplo: quando trabalhamos com strings, temos alguns métodos próprios do próprio tipo do objeto string.

``` 
let str = 'aBc';  
str.toLowerCase(); // 'abc'
str.toUpperCase(); // 'ABC'
```

Agora, imagine que pudéssemos criar nossas próprias funções/métodos e "acoplar" a esses objetos primitivos. Digamos que eu trabalhe com datas que venham do back-end e, que apesar de que na concepção delas, são datas, vão vir como string nos retornos, até porque não conseguimos muito diversidade em retornos JSON. Seria muito legal se a gente conseguisse simplesmente fazer:

``` 
let data = '01/01/2020';
data.toDate(); //retornaria uma data: Wed Jan 01 2020 00:00:00 GMT-0300 (Horário Padrão de Brasília)
```

Obviamente, este método não existe nativamente. Pra criá-lo, poderíamos simplesmente usar a função prototype que está disponível em todos os tipos de objetos do JS:

``` 
String.prototype['toDate'] = function () {
    //lógica que converte para data
}
```

Como praticamente todos os objetos Js decendem de `Object`, logo, todos esses descendentes terão esta propriedade `prototype`, que nada mais do que o retorno do próprio protótipo do objeto e que pode ser sobrescrito ou criado novas funções, que foi o caso acima. 

Essa função poderia ser declarada em qualquer lugar globalmente (como na importação de um arquivo .js no index.html) que se tornaria disponível no código inteiro. Porém, em um projeto Angular se torna um pouco mais complicado, porque por mais que ao executar o código fosse dar certo a utilização da função que foi criada, na hora de compilar, o compilador não entende que toDate não é uma função do tipo string e daria erro.  
Eu resolvi esse problema da seguinte forma. Criei um arquivo prototype.ts (ou qualquer nome que seja) e joguei num diretório qualquer. Ficou mais ou menos assim a estrutura dele:

``` 
// prototype.ts

export class Prototypes {
    static init() {
        String.prototype['toDate'] = function () {
            //lógica que converte para data
        }
    }
}
``` 

No arquivo `main.ts`, que é um arquivo do próprio projeto do Angular, em qualquer linha que seja, importo a class Prototype e inicializo ela:

```
// main.ts

import { Prototypes } from './caminho/qualquer/prototypes';
Prototypes.init();
```

Porém, se você for tentar utilizar essa função, o compilador ainda vai dar erro dizendo que essa função não existe. A solução definitiva pra isso é escrever um arquivo .d.ts, que é um arquivo que vai informar ao usuário e também ao compilador, que foi definido uma certa função para uma determinada class. Serve como se fosse um arquivo de documentação ou arquivo de declaração, para ser mais exato. Pra isso, no mesmo diretório do arquivo prototype.ts, eu criei um arquivo prototype.d.ts contendo o seguinte:

``` 
//prototype.d.ts

declare global {
    interface String {
        toDate() : Date;
    }
}
export {};
``` 

Basicamente, é uma interface do que você vai criar, com o nome da função e o tipo de retorno dela. O global é pra ele entender que é uma função que está sendo declarada globalmente e o exports no final é para exportar tudo o que tem dentro. Agora sim, já dá pra usar o toDate em qualquer lugar da aplicação sem a necessidade de nenhum outro import.

**Bônus:** essa é a minha classe completa do prototype:
``` 
//prototype.ts

export class Prototypes {
    static init(): void {
        // tslint:disable-next-line:no-string-literal
        String.prototype['toDate'] = function() {
            if (!this) { return null; }

            if (this.indexOf('/') !== -1) {
                return new Date(this.toString());
            } else if (this.indexOf('-') !== -1) {
                return new Date(this.split('-').reverse().join('/'));
            }

            return null;
        };
    }
}
``` 
