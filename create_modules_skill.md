create skill based on this notes:

this skill will create modules based on context using clean architecture with ddd concept ( based on current strcture )

1. create model
2. create pages
    - list, complete with filter ( if mentioned ), advance filter ( if mentioned ) and action
    - add, complete with form and label
    - update, complete with form and label
    - delete, with confirmation dialog
3. add i18n
    - eng
    - id
4. create services
    - api services

# filter
1. sort
    - !sort[name]=value
2. skip
    - !skip=value
3. limit
    - default = 10
    - !limit=value
4. search ( this is global search )
    - !search=value
5. equal or not equal
    - [name]=value
    - [name]!ne=value
6. greater than or greater than equal
    - [name]!gt=value
    - [name]!gte=value
7. lower than or lower than equal
    - [name]!lt=value
    - [name]!lte=value
8. in or not in
    - [name]!in=value
    - [name]!nin=value
9. is null or is not null
    - [name]!isNull=value
    - [name]!isNotNull=value

# style

! IMPORTANT !

always following current pattern