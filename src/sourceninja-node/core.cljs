 (ns sourceninja-node.core
  (:require  [clojure.set :as set]
             [cljs.nodejs :as node]))

(def npm
  (node/require "npm"))

(def https
  (node/require "https"))

(def post-port
  443)

(def post-host
  "app.sourceninja.com")

(defn post-url
  [product_id token]
  (str "/products/" product_id "/import?import_type=npm&token=" token))

(defn post-options
  [product_id token json]
  {"host" post-host
   "port" post-port
   "path" (post-url product_id token)
   "method" "POST"
   "headers" (create-headers json)})

(defn create-headers
  "create a header hash for the given content string"
  [content]
  {"Host" "www.example.com"
   "Content-Type" "application/json"
   "Content-Length" (. content -length)})

(defn json-generate
  "Returns a newline-terminate JSON string from the given
   ClojureScript data."
  [data]
  (str (JSON/stringify (vec data)) "\n"))

(defn get-product-and-token
  []
  (let [env (. js/process -env)]
    [(. env -SOURCENINJA_PRODUCT_ID)
     (. env -SOURCENINJA_PRODUCT_TOKEN)]))

(def test-deps
  {
   "npm"
   { "version" "1.1.18"
     "dependencies"
     { "semver" { "version" "1.0.13" }
       "ini" { "version" "1.0.2" }
       "slide" { "version" "1.1.3"
                 "dependencies" { "foo" {"version" "1.1.3"
                                         "dependencies" { "bar" {"version" "1.1.3"}}}}}
       "abbrev" { "version" "1.0.3" }
       "graceful-fs" { "version" "1.1.8" }
       "minimatch" { "version" "0.2.2" }
       "nopt" { "version" "1.0.10" }
       "node-uuid" { "version" "1.3.3" }
       "proto-list" { "version" "1.0.0" }
       "rimraf" { "version" "2.0.1" }
       "request" { "version" "2.9.153" }
       "which" { "version" "1.0.5" }
       "tar" { "version" "0.1.13" }
       "fstream" { "version" "0.1.18" }
       "block-stream" { "version" "0.0.5" }
       "inherits" { "version" "1.0.0" }
       "mkdirp" { "version" "0.3.0" }
       "read" { "version" "0.0.2" }
       "lru-cache" { "version" "1.0.5" }
       "node-gyp" { "version" "0.4.1" }
       "fstream-npm" { "version" "0.0.6" }
       "uid-number" { "version" "0.0.3" }
       "archy" { "version" "0.0.2" }
       "chownr" { "version" "0.0.1" } } }

   "jcrawl"
   { "version" "0.0.1",
     "dependencies"
     { "jquery" { "version" "1.6.3"}
       "jsdom" { "version" "0.2.14"}
       "request" { "version" "2.9.202" } } }
   }
  )

(defn extract-name-and-version
  "Take the intermediate output and create a set of
   hashes. Each hash contains a name and a version"
  [input]
  (into #{}
        (for [[name data] input]
          {"name" name
           "version" (get data "version")})))

(defn flatten-deps
  "Consume the graph that we get from NPM and spit out a hash of hashes.
   Each hash contains a name and a version, duplicates are eliminated"
  [input]
  (extract-name-and-version
   (loop [output {}
          input input]

     (if-not (empty? input)

       (let [notseen (remove (partial contains? output) (keys input))
             newout (reduce #(assoc %1 %2 (get input %2)) output notseen)
             ndeps (apply merge (map #(get (get input %1) "dependencies") notseen))]

         (recur newout ndeps))
       output))))

(defn post-deps
  [deps]
  (let [json (json-generate deps)
        [product_id token] (get-product-and-token)
        request (.request https (post-options product_id token json))]
    (.write request json)
    (.end request)))

(defn npm-ls-callback
  [_ _ lite]
  (let [deps (flatten-deps (js->clj (. js/lite -dependencies)))]
    (post-deps deps)))

(defn load-npm-callback
  [_ npm]
  (.ls (. js/npm -commands) [] true npm-ls-callback))


(set! *main-cli-fn* #(.load npm load-npm-callback))

;;(set! *main-cli-fn* print-deps)

;; (def http
;;   (node/require "http"))

;; (defn handler
;;   [_ res]
;;   (.writeHead res 200 (str {"Content-Type" "text/plain"}))
;;   (.end res "Hello World!\n"))

;; (defn start
;;   [& _]
;;   (let [server (.createServer http handler)]
;;     (.listen server 8001 "127.0.0.1")
;;     (println "Server running at http://127.0.0.1:8001/")))

;; var http = require('http');
;; var fs = require('fs');

;; var server = http.createServer(function (req, res) {
;;   console.log("blargl");
;;   res.writeHead(200, { "Content-Type": "text/plain" });
;;   res.end(" " + fs.readdirSync(process.cwd()));
;; });


;; var npm = require('npm');

;; npm.load(function(err, npm) {
;;     npm.commands.ls([], true, function(err, data, lite) {
;;         console.log(data); //or lite for simplified output
;;     });
;; });

;; server.listen(process.env.PORT || 8001);